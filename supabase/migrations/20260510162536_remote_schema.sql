drop extension if exists "pg_net";

create sequence "public"."achievements_id_seq";

create sequence "public"."games_id_seq";

create sequence "public"."user_achievements_id_seq";


  create table "public"."achievements" (
    "id" bigint not null default nextval('public.achievements_id_seq'::regclass),
    "game_id" bigint not null,
    "nama" character varying(255) not null,
    "deskripsi" text,
    "poin_reward" integer default 0,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."achievements" enable row level security;


  create table "public"."games" (
    "id" bigint not null default nextval('public.games_id_seq'::regclass),
    "nama" character varying(255) not null,
    "slug" character varying(255) not null,
    "thumbnail" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."games" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null,
    "username" character varying(100) not null,
    "display_name" character varying(100),
    "avatar_url" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."profiles" enable row level security;


  create table "public"."user_achievements" (
    "id" bigint not null default nextval('public.user_achievements_id_seq'::regclass),
    "user_id" uuid not null,
    "achievement_id" bigint not null,
    "unlocked_at" timestamp with time zone default now()
      );


alter table "public"."user_achievements" enable row level security;

alter sequence "public"."achievements_id_seq" owned by "public"."achievements"."id";

alter sequence "public"."games_id_seq" owned by "public"."games"."id";

alter sequence "public"."user_achievements_id_seq" owned by "public"."user_achievements"."id";

CREATE UNIQUE INDEX achievements_pkey ON public.achievements USING btree (id);

CREATE UNIQUE INDEX games_pkey ON public.games USING btree (id);

CREATE UNIQUE INDEX games_slug_key ON public.games USING btree (slug);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username);

CREATE UNIQUE INDEX unique_user_achievement ON public.user_achievements USING btree (user_id, achievement_id);

CREATE UNIQUE INDEX user_achievements_pkey ON public.user_achievements USING btree (id);

alter table "public"."achievements" add constraint "achievements_pkey" PRIMARY KEY using index "achievements_pkey";

alter table "public"."games" add constraint "games_pkey" PRIMARY KEY using index "games_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."user_achievements" add constraint "user_achievements_pkey" PRIMARY KEY using index "user_achievements_pkey";

alter table "public"."achievements" add constraint "fk_game" FOREIGN KEY (game_id) REFERENCES public.games(id) ON DELETE CASCADE not valid;

alter table "public"."achievements" validate constraint "fk_game";

alter table "public"."games" add constraint "games_slug_key" UNIQUE using index "games_slug_key";

alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

alter table "public"."user_achievements" add constraint "fk_achievement" FOREIGN KEY (achievement_id) REFERENCES public.achievements(id) ON DELETE CASCADE not valid;

alter table "public"."user_achievements" validate constraint "fk_achievement";

alter table "public"."user_achievements" add constraint "fk_user" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."user_achievements" validate constraint "fk_user";

alter table "public"."user_achievements" add constraint "unique_user_achievement" UNIQUE using index "unique_user_achievement";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_profile(p_user_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'id',               p.id,
        'username',         p.username,
        'display_name',     p.display_name,
        'avatar_url',       p.avatar_url,
        'bio',              p.bio,
        'total_poin',       p.total_poin,
        'level',            jsonb_build_object(
            'nama',         lc.nama_level,
            'warna',        lc.warna_badge,
            'min_poin',     lc.min_poin,
            'max_poin',     lc.max_poin,
            'poin_ke_next', COALESCE(lc.max_poin, 99999) 
                            - p.total_poin + 1
        ),
        'total_games',      (
            SELECT COUNT(*) FROM purchases
            WHERE user_id = p_user_id
            AND status = 'completed'
        ),
        'total_achievements', (
            SELECT COUNT(*) FROM user_achievements
            WHERE user_id = p_user_id
        ),
        'global_rank',      (
            SELECT COUNT(*) + 1 FROM profiles
            WHERE total_poin > p.total_poin
        ),
        'member_since',     p.created_at
    )
    INTO v_result
    FROM profiles p
    LEFT JOIN level_config lc ON p.level_id = lc.id
    WHERE p.id = p_user_id;

    RETURN v_result;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.purchase_game(p_user_id uuid, p_game_id bigint)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_harga         DECIMAL(12,2);
    v_harga_diskon  DECIMAL(12,2);
    v_harga_bayar   DECIMAL(12,2);
    v_already_owned BOOLEAN;
    v_game_status   VARCHAR(20);
BEGIN
    -- Ambil info game
    SELECT harga, harga_diskon, status
    INTO v_harga, v_harga_diskon, v_game_status
    FROM games
    WHERE id = p_game_id;

    IF NOT FOUND THEN
        RETURN '{"error": "Game tidak ditemukan"}'::JSONB;
    END IF;

    IF v_game_status != 'active' THEN
        RETURN '{"error": "Game tidak tersedia untuk dibeli"}'::JSONB;
    END IF;

    -- Cek sudah punya
    SELECT EXISTS (
        SELECT 1 FROM purchases
        WHERE user_id = p_user_id
        AND game_id = p_game_id
        AND status = 'completed'
    ) INTO v_already_owned;

    IF v_already_owned THEN
        RETURN '{"error": "Kamu sudah memiliki game ini"}'::JSONB;
    END IF;

    -- Tentukan harga bayar
    v_harga_bayar := COALESCE(v_harga_diskon, v_harga);

    -- Insert purchase
    INSERT INTO purchases (user_id, game_id, harga_bayar)
    VALUES (p_user_id, p_game_id, v_harga_bayar);

    -- Hapus dari cart jika ada
    DELETE FROM cart
    WHERE user_id = p_user_id
    AND game_id = p_game_id;

    RETURN jsonb_build_object(
        'success', true,
        'harga_bayar', v_harga_bayar,
        'pesan', 'Pembelian berhasil!'
    );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.unlock_achievement(p_user_id uuid, p_achievement_id bigint)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_game_id           BIGINT;
    v_poin              INT;
    v_is_owned          BOOLEAN;
    v_already_unlocked  BOOLEAN;
BEGIN
    -- Ambil game_id dan poin dari achievement
    SELECT game_id, poin_reward
    INTO v_game_id, v_poin
    FROM achievements
    WHERE id = p_achievement_id;

    IF NOT FOUND THEN
        RETURN '{"error": "Achievement tidak ditemukan"}'::JSONB;
    END IF;

    -- Validasi user memiliki game
    SELECT EXISTS (
        SELECT 1 FROM purchases
        WHERE user_id = p_user_id
        AND game_id = v_game_id
        AND status = 'completed'
    ) INTO v_is_owned;

    IF NOT v_is_owned THEN
        RETURN '{"error": "Kamu belum memiliki game ini"}'::JSONB;
    END IF;

    -- Validasi belum pernah unlock
    SELECT EXISTS (
        SELECT 1 FROM user_achievements
        WHERE user_id = p_user_id
        AND achievement_id = p_achievement_id
    ) INTO v_already_unlocked;

    IF v_already_unlocked THEN
        RETURN '{"error": "Achievement sudah di-unlock sebelumnya"}'::JSONB;
    END IF;

    -- Insert unlock record
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (p_user_id, p_achievement_id);

    -- Tambah poin ke profile user
    UPDATE profiles
    SET total_poin = total_poin + v_poin
    WHERE id = p_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'poin_didapat', v_poin,
        'pesan', 'Achievement berhasil di-unlock!'
    );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_level()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Cari level yang sesuai berdasarkan poin baru
    UPDATE profiles
    SET level_id = (
        SELECT id FROM level_config
        WHERE NEW.total_poin >= min_poin
        AND (
            max_poin IS NULL 
            OR NEW.total_poin <= max_poin
        )
        ORDER BY min_poin DESC
        LIMIT 1
    )
    WHERE id = NEW.id;
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."achievements" to "anon";

grant insert on table "public"."achievements" to "anon";

grant references on table "public"."achievements" to "anon";

grant select on table "public"."achievements" to "anon";

grant trigger on table "public"."achievements" to "anon";

grant truncate on table "public"."achievements" to "anon";

grant update on table "public"."achievements" to "anon";

grant delete on table "public"."achievements" to "authenticated";

grant insert on table "public"."achievements" to "authenticated";

grant references on table "public"."achievements" to "authenticated";

grant select on table "public"."achievements" to "authenticated";

grant trigger on table "public"."achievements" to "authenticated";

grant truncate on table "public"."achievements" to "authenticated";

grant update on table "public"."achievements" to "authenticated";

grant delete on table "public"."achievements" to "service_role";

grant insert on table "public"."achievements" to "service_role";

grant references on table "public"."achievements" to "service_role";

grant select on table "public"."achievements" to "service_role";

grant trigger on table "public"."achievements" to "service_role";

grant truncate on table "public"."achievements" to "service_role";

grant update on table "public"."achievements" to "service_role";

grant delete on table "public"."games" to "anon";

grant insert on table "public"."games" to "anon";

grant references on table "public"."games" to "anon";

grant select on table "public"."games" to "anon";

grant trigger on table "public"."games" to "anon";

grant truncate on table "public"."games" to "anon";

grant update on table "public"."games" to "anon";

grant delete on table "public"."games" to "authenticated";

grant insert on table "public"."games" to "authenticated";

grant references on table "public"."games" to "authenticated";

grant select on table "public"."games" to "authenticated";

grant trigger on table "public"."games" to "authenticated";

grant truncate on table "public"."games" to "authenticated";

grant update on table "public"."games" to "authenticated";

grant delete on table "public"."games" to "service_role";

grant insert on table "public"."games" to "service_role";

grant references on table "public"."games" to "service_role";

grant select on table "public"."games" to "service_role";

grant trigger on table "public"."games" to "service_role";

grant truncate on table "public"."games" to "service_role";

grant update on table "public"."games" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."user_achievements" to "anon";

grant insert on table "public"."user_achievements" to "anon";

grant references on table "public"."user_achievements" to "anon";

grant select on table "public"."user_achievements" to "anon";

grant trigger on table "public"."user_achievements" to "anon";

grant truncate on table "public"."user_achievements" to "anon";

grant update on table "public"."user_achievements" to "anon";

grant delete on table "public"."user_achievements" to "authenticated";

grant insert on table "public"."user_achievements" to "authenticated";

grant references on table "public"."user_achievements" to "authenticated";

grant select on table "public"."user_achievements" to "authenticated";

grant trigger on table "public"."user_achievements" to "authenticated";

grant truncate on table "public"."user_achievements" to "authenticated";

grant update on table "public"."user_achievements" to "authenticated";

grant delete on table "public"."user_achievements" to "service_role";

grant insert on table "public"."user_achievements" to "service_role";

grant references on table "public"."user_achievements" to "service_role";

grant select on table "public"."user_achievements" to "service_role";

grant trigger on table "public"."user_achievements" to "service_role";

grant truncate on table "public"."user_achievements" to "service_role";

grant update on table "public"."user_achievements" to "service_role";



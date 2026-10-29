-- Transactional integration checks: every fixture is rolled back.
begin;
insert into auth.users(id,email) values ('a1000000-0000-4000-8000-000000000001','macha-rls-fixture@example.invalid');
insert into public.portfolio_owner(user_id) values ('a1000000-0000-4000-8000-000000000001');
insert into public.projects(slug,title,summary,cover_url,status) values ('rls-private-fixture','Private fixture','Must stay private','/images/mbg-concept.png','draft');
set local role anon;
select set_config('request.jwt.claims','{"role":"anon"}',true);
do $$ begin
 if exists(select 1 from public.projects where slug='rls-private-fixture') then raise exception 'FAIL: anon sees draft'; end if;
 if not exists(select 1 from public.profile where id=1) then raise exception 'FAIL: anon cannot read profile'; end if;
 begin update public.profile set headline='unauthorized' where id=1;raise exception 'FAIL: anon update allowed';exception when insufficient_privilege then null;end;
end $$;
reset role;
set local role authenticated;
select set_config('request.jwt.claims','{"role":"authenticated","sub":"a2000000-0000-4000-8000-000000000002"}',true);
do $$ declare affected integer;begin
 if exists(select 1 from public.projects where slug='rls-private-fixture') then raise exception 'FAIL: non-owner sees draft'; end if;
 update public.profile set headline='unauthorized' where id=1;get diagnostics affected=row_count;if affected<>0 then raise exception 'FAIL: non-owner updated profile';end if;
 begin insert into public.projects(slug,title,summary,cover_url) values ('bad-write','Bad','Blocked','/images/mbg-concept.png');raise exception 'FAIL: non-owner insert allowed';exception when insufficient_privilege then null;end;
 begin insert into public.portfolio_owner(user_id) values ('a2000000-0000-4000-8000-000000000002');raise exception 'FAIL: self enrollment allowed';exception when insufficient_privilege then null;end;
end $$;
reset role;
set local role authenticated;
select set_config('request.jwt.claims','{"role":"authenticated","sub":"a1000000-0000-4000-8000-000000000001"}',true);
do $$ declare affected integer;begin
 if not exists(select 1 from public.projects where slug='rls-private-fixture') then raise exception 'FAIL: owner cannot read draft';end if;
 update public.profile set headline='Owner test' where id=1;get diagnostics affected=row_count;if affected<>1 then raise exception 'FAIL: owner cannot update profile';end if;
 update public.projects set summary='Owner test' where slug='rls-private-fixture';get diagnostics affected=row_count;if affected<>1 then raise exception 'FAIL: owner cannot update draft';end if;
 insert into storage.objects(bucket_id,name) values ('portfolio','a1000000-0000-4000-8000-000000000001/rls-test.png');
end $$;
reset role;
select 'PASS: anon read, draft privacy, non-owner deny, no self-enrollment, owner update and storage insert' as result;
rollback;

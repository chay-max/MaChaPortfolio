revoke all on public.portfolio_owner, public.profile, public.projects from anon, authenticated;
grant select on public.portfolio_owner to authenticated;
grant select on public.profile, public.projects to anon, authenticated;
grant update on public.profile to authenticated;
grant insert,update,delete on public.projects to authenticated;

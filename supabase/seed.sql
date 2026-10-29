-- Optional development seed; run only in a NEW database after migrations.
insert into public.profile(id,full_name,headline,intro,bio,location,learning,github_url,availability)
values(1,'Maxwell Christopher Chay','Student developer, driven by curiosity.','Saya belajar, membangun, dan mendokumentasikan perjalanan saya di dunia teknologi.','Pelajar SMA di Indonesia. Tertarik pada pengembangan web dan teknologi.','Indonesia',array['React','Next.js','Python'],'https://github.com/chay-max','Terbuka untuk belajar dan berkolaborasi')
on conflict(id) do nothing;
insert into public.projects(slug,title,summary,description,role,year,tags,cover_url,cover_is_concept,status,sort_order)
values('mbg-report','MBG Report','Eksplorasi platform pelaporan makanan harian untuk program Makan Bergizi Gratis.','MBG Report adalah proyek tim untuk IT FEST ISTTS 2026 bertema Sustainable Development Goals. Konsepnya menghubungkan masyarakat dan SPPG melalui laporan makanan harian. Proyek masih berupa prototype kompetisi. Cover adalah ilustrasi konsep.','Proyek tim · Pelajar',2026,array['React','Tailwind CSS','MERN'],'/images/mbg-concept.png',true,'published',0)
on conflict(slug) do nothing;

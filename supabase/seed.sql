-- Optional development seed; run only in a NEW database after migrations.
insert into public.profile(id,full_name,headline,intro,bio,location,learning,github_url,availability)
values(1,'Maxwell Christopher Chay','Student developer, driven by curiosity.','I learn, build, and document my journey in technology.','A high school student in Indonesia, exploring web development and technology.','Indonesia',array['React','Next.js','Python'],'https://github.com/chay-max','Open to learning and collaboration')
on conflict(id) do nothing;
insert into public.projects(slug,title,summary,description,role,year,tags,cover_url,cover_is_concept,status,sort_order)
values('mbg-report','MBG Report','Exploring daily meal reporting for Indonesia’s Free Nutritious Meals program (MBG).','MBG Report is a student team project developed for IT FEST ISTTS 2026, inspired by the Sustainable Development Goals. It explores daily meal reporting between the public and SPPG nutrition service units. This is a competition prototype; the cover is a concept illustration.','Student team project',2026,array['React','Tailwind CSS','MERN'],'/images/mbg-concept.png',true,'published',0)
on conflict(slug) do nothing;

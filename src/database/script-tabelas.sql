set names utf8mb4;

create database if not exists edgerunning;

use edgerunning;

create table if not exists usuario (
idUsuario int primary key auto_increment,
nome varchar(45) not null,
email varchar(100) not null unique,
	constraint chkEmail check (email like '%@%'),
senha varchar(255) not null,
dtCadastro datetime default current_timestamp
);

create table if not exists tempoJogo (
fkUsuario int primary key,
horasJogadas int default 0,
dtHoras datetime,
	constraint fkTempoJogo_usuario foreign key (fkUsuario) references usuario(idUsuario)
);

set @temColunaHoras = (
	select count(*) from information_schema.columns
		where table_schema = database() and table_name = 'usuario' and column_name = 'horasJogadas'
);
set @comandoCopiarHoras = if(@temColunaHoras = 0, 'do 0', 'insert ignore into tempoJogo (fkUsuario, horasJogadas, dtHoras) select idUsuario, horasJogadas, dtHoras from usuario where dtHoras is not null');
prepare copiarHoras from @comandoCopiarHoras;
execute copiarHoras;
deallocate prepare copiarHoras;
set @comandoRemoverHoras = if(@temColunaHoras = 0, 'do 0', 'alter table usuario drop column horasJogadas, drop column dtHoras');
prepare removerHoras from @comandoRemoverHoras;
execute removerHoras;
deallocate prepare removerHoras;

create table if not exists conquista (
idConquista int primary key auto_increment,
nome varchar(60) not null unique,
descricao varchar(150),
raridadeGlobal decimal(4,1),
imagem varchar(80)
);

set @temColunaImagem = (
	select count(*) from information_schema.columns
		where table_schema = database() and table_name = 'conquista' and column_name = 'imagem'
);
set @comandoImagem = if(@temColunaImagem = 0, 'alter table conquista add column imagem varchar(80)', 'do 0');
prepare adicionarImagem from @comandoImagem;
execute adicionarImagem;
deallocate prepare adicionarImagem;

create table if not exists conquistaUsuario (
fkUsuario int,
fkConquista int,
dtDesbloqueio date not null,
	constraint fkConquistaUsuario_usuario foreign key (fkUsuario) references usuario(idUsuario),
	constraint fkConquistaUsuario_conquista foreign key (fkConquista) references conquista(idConquista),
primary key (fkUsuario, fkConquista)
);

insert into conquista (nome, descricao, raridadeGlobal, imagem) values
('The Fool', '', 88.4, 'the-fool.jpg'),
('The Lovers', '', 67.2, 'the-lovers.jpg'),
('Right Back At Ya', 'Mate ou incapacite um inimigo que jogou uma granada em você.', 65.9, 'right-back-at-ya.jpg'),
('The Wheel of Fortune', '', 53.8, 'the-wheel-of-fortune.jpg'),
('Stanislavski''s Method', 'Use 10 vezes uma opção de diálogo ligada ao histórico de V.', 50.9, 'stanislavskis-method.jpg'),
('The Hermit', '', 50.4, 'the-hermit.jpg'),
('True Soldier', 'Mate ou incapacite 300 inimigos com armas de longo alcance.', 46.7, 'true-soldier.jpg'),
('The High Priestess', '', 45.3, 'the-high-priestess.jpg'),
('Full Body Conversion', 'Instale ao menos um implante em cada sistema e parte do corpo.', 42.8, 'full-body-conversion.jpg'),
('Christmas Tree Attack', 'Conclua um Breach Protocol com pelo menos 3 daemons enviados.', 42.5, 'christmas-tree-attack.jpg'),
('Legend of The Afterlife', 'Alcance o Street Cred máximo.', 41.6, 'legend-of-the-afterlife.jpg'),
('Life of the Road', '', 40, 'life-of-the-road.jpg'),
('Gun Fu', 'Mate ou incapacite 3 inimigos em sequência com revólver ou pistola a curta distância.', 37.5, 'gun-fu.jpg'),
('The World', 'Conclua a história principal.', 35.1, 'the-world.jpg'),
('Bushido and Chill', '', 32.7, 'bushido-and-chill.jpg'),
('True Warrior', 'Mate ou incapacite 100 inimigos com armas brancas.', 31.6, 'true-warrior.jpg'),
('Master Crafter', 'Fabrique 3 itens lendários.', 31.1, 'master-crafter.jpg'),
('Judy vs Night City', '', 29.6, 'judy-vs-night-city.jpg'),
('Two Heads, One Bullet', 'Mate ou incapacite 2 inimigos com o mesmo tiro de rifle de precisão.', 27.1, 'two-heads-one-bullet.jpg'),
('To Protect and Serve', '', 26.5, 'to-protect-and-serve.jpg'),
('The Quick and the Dead', 'Mate ou incapacite 50 inimigos com o tempo desacelerado.', 26.5, 'the-quick-and-the-dead.jpg'),
('All the President''s Men', 'Salve a presidente Myers.', 25.1, 'all-the-presidents-men.jpg'),
('Arachnophobia', '', 24.7, 'arachnophobia.jpg'),
('I Am The Law', 'Conclua todos os avistamentos de ciberpsicóticos.', 24.5, 'i-am-the-law.jpg'),
('The Wandering Fool', 'Encontre todos os grafites de tarô do trabalho Fool on the Hill.', 20.9, 'the-wandering-fool.jpg'),
('Ten out of Ten', 'Alcance o nível máximo em qualquer habilidade.', 19.7, 'ten-out-of-ten.jpg'),
('Breathtaking', 'Colete todos os itens que pertenceram a Johnny Silverhand.', 16.9, 'breathtaking.jpg'),
('The Sun', '', 16.8, 'the-sun.jpg'),
('V for Vendetta', 'Depois de reviver com o Segundo Coração, elimine quem te matou em até 5 segundos.', 16.6, 'v-for-vendetta.jpg'),
('The Star', '', 16.4, 'the-star.jpg'),
('To Bad Decisions!', '', 15.8, 'to-bad-decisions.jpg'),
('Spin Doctor', '', 14, 'spin-doctor.jpg'),
('Temperance', '', 12.5, 'temperance.jpg'),
('Must Be Rats', 'Use o quickhack Distrair Inimigos 30 vezes sem chamar atenção.', 11.6, 'must-be-rats.jpg'),
('Easy Come, Easy Go', 'Roube o caminhão médico da Arasaka ou entregue 10 veículos ao El Capitan.', 11.2, 'easy-come-easy-go.jpg'),
('King of Wands', '', 10.9, 'king-of-wands.jpg'),
('The Jungle', 'Conclua todos os gigs e ocorrências NCPD de Santo Domingo.', 9.8, 'the-jungle.jpg'),
('Dirty Deeds', 'Conclua todos os gigs de Dogtown.', 9.5, 'dirty-deeds.jpg'),
('Mean Streets', 'Conclua todos os gigs e ocorrências NCPD de Heywood.', 9.2, 'mean-streets.jpg'),
('Gunslinger', 'Acerte uma granada inimiga no ar com um revólver.', 9, 'gunslinger.jpg'),
('Frequent Flyer', 'Encontre todos os terminais de viagem rápida.', 9, 'frequent-flyer.jpg'),
('City Lights', 'Conclua todos os gigs e ocorrências NCPD do City Center.', 8.8, 'city-lights.jpg'),
('It''s Elementary', 'Conclua todos os gigs e ocorrências NCPD de Watson.', 8.6, 'its-elementary.jpg'),
('Greetings from Pacifica!', 'Conclua todos os gigs e ocorrências NCPD de Pacifica.', 7.9, 'greetings-from-pacifica.jpg'),
('Little Tokyo', 'Conclua todos os gigs e ocorrências NCPD de Westbrook.', 7.8, 'little-tokyo.jpg'),
('Autojock', 'Compre todos os veículos disponíveis para compra.', 7.7, 'autojock.jpg'),
('The Devil', '', 7.3, 'the-devil.jpg'),
('The APB is Not Enough', 'Torne-se o criminoso mais procurado de Dogtown.', 7.3, 'the-apb-is-not-enough.jpg'),
('The Wasteland', 'Conclua todos os gigs e ocorrências NCPD das Badlands.', 7.2, 'the-wasteland.jpg'),
('Relic Ruler', 'Desbloqueie todas as vantagens da árvore Relic.', 6.7, 'relic-ruler.jpg'),
('Rough Landing', 'Com o Berserk ativo, faça uma Aterrissagem de Super-Herói que elimine 2 inimigos.', 6.4, 'rough-landing.jpg'),
('The Tower', '', 6.4, 'the-tower.jpg'),
('Judgement Day', 'Elimine três chefes da categoria "Aumento de atividade criminosa".', 6.2, 'judgement-day.jpg'),
('King of Swords', '', 6, 'king-of-swords.jpg'),
('Daemon In The Shell', 'Mate ou incapacite 3 inimigos com um único quickhack Detonar Granada.', 5.8, 'daemon-in-the-shell.jpg'),
('King of Pentacles', '', 4.8, 'king-of-pentacles.jpg'),
('King of Cups', '', 4.2, 'king-of-cups.jpg')
on duplicate key update imagem = values(imagem);

create table if not exists categoria (
idCategoria int primary key auto_increment,
nome varchar(45) not null unique,
descricao varchar(60),
total int not null
);

create table if not exists progresso (
fkUsuario int,
fkCategoria int,
concluidas int default 0,
	constraint fkProgresso_usuario foreign key (fkUsuario) references usuario(idUsuario),
	constraint fkProgresso_categoria foreign key (fkCategoria) references categoria(idCategoria),
primary key (fkUsuario, fkCategoria)
);

insert ignore into categoria (nome, descricao, total) values
('Missões principais', 'história e finais', 26),
('Trabalhos secundários', 'side jobs', 60),
('Gigs', 'fixers de todos os distritos', 75),
('Ocorrências NCPD', 'scanner hustles', 160),
('Ciberpsicóticos', 'avistamentos', 17),
('Cartas de tarô', 'grafites pela cidade', 23),
('Veículos', 'garagem', 90),
('Armas icônicas', 'arsenal', 70);

create or replace view vwConquistaUsuario as
select u.idUsuario,
	c.idConquista,
	c.nome,
	c.descricao,
	c.raridadeGlobal,
	c.imagem,
	date_format(cu.dtDesbloqueio, '%Y-%m-%d') as dtDesbloqueio
from usuario as u
	cross join conquista as c
	left join conquistaUsuario as cu
		on cu.fkUsuario = u.idUsuario and cu.fkConquista = c.idConquista;

create or replace view vwProgressoUsuario as
select u.idUsuario,
	c.idCategoria,
	c.nome,
	c.descricao,
	c.total,
	ifnull(p.concluidas, 0) as concluidas
from usuario as u
	cross join categoria as c
	left join progresso as p
		on p.fkCategoria = c.idCategoria and p.fkUsuario = u.idUsuario;

create or replace view vwPerfilUsuario as
select u.idUsuario,
	u.nome,
	t.horasJogadas,
	t.dtHoras
from usuario as u
	left join tempoJogo as t
		on t.fkUsuario = u.idUsuario;

select * from usuario;
select * from vwPerfilUsuario;
select * from conquista;
select * from vwConquistaUsuario where dtDesbloqueio is not null;
select * from vwProgressoUsuario;

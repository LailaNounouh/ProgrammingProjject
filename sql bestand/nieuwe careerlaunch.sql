/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.13-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: careerlaunch
-- ------------------------------------------------------
-- Server version	10.11.13-MariaDB-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Admins`
--

DROP TABLE IF EXISTS `Admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Admins` (
  `admin_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `naam` varchar(100) NOT NULL,
  `wachtwoord` varchar(255) NOT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admins`
--

LOCK TABLES `Admins` WRITE;
/*!40000 ALTER TABLE `Admins` DISABLE KEYS */;
INSERT INTO `Admins` VALUES
(1,'groep13@ehb.be','admin','$2b$10$bj/MuJTfrZcKbWsRSoUeWuSgiSKRnsTwtuGKGun5j0GT4r1fzhB1W');
/*!40000 ALTER TABLE `Admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Afspraken`
--

DROP TABLE IF EXISTS `Afspraken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Afspraken` (
  `afspraak_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `bedrijf_id` bigint(20) unsigned NOT NULL,
  `tijdslot` varchar(10) NOT NULL,
  `datum` date NOT NULL DEFAULT curdate(),
  PRIMARY KEY (`afspraak_id`),
  UNIQUE KEY `unieke_afspraak` (`bedrijf_id`,`tijdslot`,`datum`),
  CONSTRAINT `Afspraken_ibfk_1` FOREIGN KEY (`bedrijf_id`) REFERENCES `Bedrijven` (`bedrijf_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Afspraken`
--

LOCK TABLES `Afspraken` WRITE;
/*!40000 ALTER TABLE `Afspraken` DISABLE KEYS */;
INSERT INTO `Afspraken` VALUES
(1,1,2,'14:30','2025-06-17'),
(2,1,3,'15:30','2025-06-17'),
(3,1,3,'15:15','2025-06-17'),
(4,1,3,'15:00','2025-06-17'),
(22,1,10,'16:00','2025-06-19'),
(23,7,6,'14:15','2025-06-19'),
(24,1,1,'13:45','2025-06-19'),
(25,7,9,'16:00','2025-06-19'),
(26,1,1,'14:15','2025-06-19'),
(27,1,1,'16:15','2025-06-19'),
(28,1,1,'14:00','2025-06-19');
/*!40000 ALTER TABLE `Afspraken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Bedrijf_Sector`
--

DROP TABLE IF EXISTS `Bedrijf_Sector`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Bedrijf_Sector` (
  `bedrijf_id` bigint(20) unsigned NOT NULL,
  `sector_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`bedrijf_id`,`sector_id`),
  KEY `sector_id` (`sector_id`),
  CONSTRAINT `Bedrijf_Sector_ibfk_1` FOREIGN KEY (`bedrijf_id`) REFERENCES `Bedrijven` (`bedrijf_id`),
  CONSTRAINT `Bedrijf_Sector_ibfk_2` FOREIGN KEY (`sector_id`) REFERENCES `Sectoren` (`sector_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Bedrijf_Sector`
--

LOCK TABLES `Bedrijf_Sector` WRITE;
/*!40000 ALTER TABLE `Bedrijf_Sector` DISABLE KEYS */;
INSERT INTO `Bedrijf_Sector` VALUES
(3,3),
(4,3),
(5,1),
(6,2);
/*!40000 ALTER TABLE `Bedrijf_Sector` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Bedrijven`
--

DROP TABLE IF EXISTS `Bedrijven`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Bedrijven` (
  `bedrijf_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `naam` varchar(255) NOT NULL,
  `straat` varchar(255) DEFAULT NULL,
  `nummer` varchar(10) DEFAULT NULL,
  `postcode` varchar(10) DEFAULT NULL,
  `gemeente` varchar(255) DEFAULT NULL,
  `telefoonnummer` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `btw_nummer` varchar(50) DEFAULT NULL,
  `contactpersoon_facturatie` varchar(255) DEFAULT NULL,
  `email_facturatie` varchar(255) DEFAULT NULL,
  `po_nummer` varchar(255) DEFAULT NULL,
  `contactpersoon_beurs` varchar(255) DEFAULT NULL,
  `email_beurs` varchar(255) DEFAULT NULL,
  `website_of_linkedin` varchar(255) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `staat_van_betaling` varchar(50) DEFAULT NULL,
  `standselectie` varchar(100) DEFAULT NULL,
  `opleidingsmatch` varchar(100) DEFAULT NULL,
  `wachtwoord` varchar(255) NOT NULL,
  `beschikbare_tijdsloten` varchar(500) DEFAULT NULL,
  `speeddates` tinyint(1) DEFAULT 0,
  `aanbiedingen` varchar(255) DEFAULT NULL,
  `doelgroep_opleiding` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`bedrijf_id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Bedrijven`
--

LOCK TABLES `Bedrijven` WRITE;
/*!40000 ALTER TABLE `Bedrijven` DISABLE KEYS */;
INSERT INTO `Bedrijven` VALUES
(1,'Accenture','Rue Picard','11 Box 100','1000','Brussel','+32 2 267 21 11','info@accenture.be','BE0881234567','Marie Dubois',NULL,NULL,NULL,NULL,'https://www.accenture.com/be-en',NULL,NULL,NULL,NULL,'$2b$12$9fXxdMIoW6XUqHXPOLKh3eOUGG0NK95RaitpLF6JF6/NO0eY1Ao2e','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica, Bachelor Multimedia & Creative Technologies, Graduaat Programmeren, Graduaat Systeem- & Netwerkbeheer, Graduaat Internet of Things, Graduaat Elektromechanische Systemen'),
(2,'Adecco','Noordkustlaan','16 B','1702','Dilbeek','+32 2 583 91 11','info@adecco.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.adecco.be',NULL,NULL,NULL,NULL,'$2b$12$x7wFoUf0oJ1UZM1nnau16OPGDJZUCatUL2jPscrmy4KDVmjtZBMrK','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica, Bachelor Multimedia & Creative Technologies, Graduaat Programmeren'),
(3,'Altran','Avenue de Tervuren','270','1150','Woluwe‑Saint‑Pierre','+32 2 737 68 11','info@altran.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.altran.be',NULL,NULL,NULL,NULL,'$2b$12$fvaCsZdIo83vG5v7bU2pnu.jgvJJ.fMN5O4sGw5.30ISr2UVJ00Cq','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica, Graduaat Programmeren'),
(4,'ARHS Developments','Ikaroslaan','53','1930','Zaventem','+32 2 774 88 30','info@arhsdevelopments.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.arhs-developments.com',NULL,NULL,NULL,NULL,'$2b$12$uHodJc7v0d7KOhJpI9d/..BoqWQyoeF4pUs5DbatcfDS3rmwKC4GO','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica, Graduaat Programmeren'),
(5,'Avit Group','Sneeuwbeslaan','20 Box 15','2610','Wilrijk (Antwerpen)','+32 3 302 45 11','info@avitgroup.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.avitgroup.be',NULL,NULL,NULL,NULL,'$2b$12$eUhMTnU1y8o8vIqUbXM6lerLu0UdpJnE.zFeSHIVrPMjg7q0jeIFy','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica'),
(6,'Cegeka','Interleuvenlaan','16','3001','Leuven','+32 16 39 39 39','info@cegeka.be','BE0643322110','Eva Willems',NULL,NULL,NULL,NULL,'https://www.cegeka.com',NULL,NULL,NULL,NULL,'$2b$12$NuH9NBvVIwRY5XsG2nNI8OnthBIdaerurzVUJSw5YoXQ8ZSzlJGTG','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica, Graduaat Programmeren, Graduaat Internet of Things'),
(7,'Dimension Data','Koning Albert II-laan','28','1000','Brussel','+32 2 704 24 00','info@dimensiondata.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.dimensiondata.com',NULL,NULL,NULL,NULL,'$2b$12$HuY.29y3O1EEgZKkJvkM5ODFEjREz9R.qwjzooTcIx150YeP02yny','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica'),
(8,'DXC Technology','Da Vincilaan','9A','1930','Zaventem','+32 2 717 40 00','info@dxctechnology.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.dxc.technology',NULL,NULL,NULL,NULL,'$2b$12$hINrUzMw86Zq9ZCwRj1E.OoAiC7SvPfrQMecA96dhgzAbuVHQa54m','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica, Graduaat Programmeren'),
(9,'Eandis','Koning Albert II-laan','32','1000','Brussel','+32 70 220 900','info@eandis.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.eandis.be',NULL,NULL,NULL,NULL,'$2b$12$9tgZ27D7bvfaLRVD00FwZeP4kPPkXOuFj5aDLmKm9g7zlkyTsb3vq','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica, Graduaat Programmeren'),
(10,'Easy Shift','Korte Lozanastraat','20','2018','Antwerpen','+32 3 369 28 10','info@easyshift.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.easyshift.be',NULL,NULL,NULL,NULL,'$2b$12$sC3P6Jks2VTBcMlV5oZMqufy6hh1exLaMIkiDio4T/ldNi58UpZO2','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica, Graduaat Programmeren'),
(11,'Econocom','Chausée de La Hulpe','181','1170','Watermael-Boitsfort','+32 2 353 20 11','info@econocom.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.econocom.com',NULL,NULL,NULL,NULL,'$2b$12$MMDAT5nh8w.vbkIx7DqjlOGbQr7ICEgon7tTuHHAnI/0F/T/CGjha','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica, Graduaat Programmeren, Graduaat Internet of Things'),
(12,'Enable U','Chaudfontainevaart','12','4000','Luik','+32 4 341 23 45','info@enableu.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.enableu.be',NULL,NULL,NULL,NULL,'$2b$12$vqWlpIfP6Zhbaio2HXAVr.j5swZbY8YWopUDPXZKj/HayaEjqpj9u','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica'),
(13,'Endouble','Avenue Jules Bordet','142','1140','Evere','+32 2 219 22 50','info@endouble.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.endouble.com',NULL,NULL,NULL,NULL,'$2b$12$89ZcI8h9Wjzo819vj7agfetJ10mkE8Gz.Ecj2xmUqOeWKT9hlzkxG','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica, Bachelor Multimedia & Creative Technologies, Graduaat Programmeren'),
(14,'Exclusive Networks','Rue des Deux Eglises','59','1000','Brussel','+32 2 213 13 40','info@exclusivenetworks.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.exclusivenetworks.com',NULL,NULL,NULL,NULL,'$2b$12$V4SwRkQcT0nGhXkBwnnnSOk4.uYfuIm5uxS8hN.HWLudnNRinACRa','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica, Graduaat Programmeren'),
(15,'Fabulor','Chaussée de Gand','456','1080','Molenbeek','+32 2 410 12 34','info@fabulor.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.fabulor.be',NULL,NULL,NULL,NULL,'$2b$12$m42MV0WLBju7GGK2vEGriuFJS5sX6MamfAoZcNpE8atdkLYKXbHiG','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Multimedia & Creative Technologies'),
(16,'Flexso','Avenue Paul Spaak','6','1070','Anderlecht','+32 2 523 55 00','info@flexso.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.flexso.com',NULL,NULL,NULL,NULL,'$2b$12$EPp3ke0OtRWW2Npv4r3Yje/31rNpGRPrYNbe65txR93ahR7k4rVYK','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica, Graduaat Programmeren, Graduaat Internet of Things'),
(17,'Grasshoppers Academy','Bronstraat','10','1850','Grimbergen','+32 2 269 12 34','info@ghac.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.grasshoppers.academy',NULL,NULL,NULL,NULL,'$2b$12$HRewu8oBrfbg6NdsESeP6OUuSlrKEkSJt7qRvUVAz0aWbFor2A0em','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica'),
(18,'Gumption','Rue de la Loi','82','1040','Brussel','+32 2 203 00 20','info@gumption.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.gumption.eu',NULL,NULL,NULL,NULL,'$2b$12$JT2TIOUDze0MhEiQ1RF6HOcomXheQcAIWM17.MVkhpMhPgeSChY3y','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica'),
(19,'Harvey Nash BELGIUM','Avenue Louise','166','1050','Brussel','+32 2 639 39 00','info@harveynash.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.harveynash.be',NULL,NULL,NULL,NULL,'$2b$12$CxO1J2f.yKLSu8xcq/y8F.0vhQMPZUwtAK3eUvz6ebFGjaBncDrqG','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica, Graduaat Programmeren'),
(20,'ICT Talents','Korenmarkt','11','1000','Brussel','+32 2 223 44 55','info@icttalents.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.icttalents.be',NULL,NULL,NULL,NULL,'$2b$12$tw4cuHJQT8y7bi1RHorG0OX7JsgWRBuGmB5rN19e4ERef3pnAce8W','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica, Graduaat Programmeren'),
(41,'Inetum-Realdolmen',NULL,NULL,NULL,NULL,'+32 2 555 0012','info@inetumrealdolmen.be','BE0432123456','Lien Cornelis',NULL,NULL,NULL,NULL,'https://www.inetum-realdolmen.world',NULL,NULL,NULL,NULL,'$2b$12$zUuXcnjGQb5WaIgjLF39WOwsu1AAtiP4uqW185F1CkKu9yparl1xy','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica, Graduaat Programmeren, Graduaat Internet of Things'),
(42,'Keleos',NULL,NULL,NULL,NULL,'+32 2 555 0013','info@keleos.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.keleos.com',NULL,NULL,NULL,NULL,'$2b$12$Ivyz8zr9CPHaBCeYwJTM5.DTvgn.rXCVAk9Uht7Ygv/cp5qNXWxRy','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica'),
(43,'Launch.Career',NULL,NULL,NULL,NULL,'+32 2 555 0014','info@launchcareer.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.launch.career',NULL,NULL,NULL,NULL,'$2b$12$ncwex8dTtK2/80gCuSjs2uZ6fi.EchjKKGI37z0lTepPCOCzm3HCO','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica'),
(44,'Nexios IT',NULL,NULL,NULL,NULL,'+32 2 555 0015','info@nexiosit.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.nexios.be',NULL,NULL,NULL,NULL,'$2b$12$p393VMWQWN80k9y.YttfWO3Vv.VOxnapHKElrm3KVApUH95QMG27a','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica, Graduaat Programmeren'),
(45,'Nomios',NULL,NULL,NULL,NULL,'+32 2 555 0016','info@nomios.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.nomios.be',NULL,NULL,NULL,NULL,'$2b$12$qstQqOiRDFn0JB4MvNKFn.dtRn4s60u4OcqUGIKua6n8q2HymA0o.','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica, Graduaat Systeem- & Netwerkbeheer'),
(46,'Ordina',NULL,NULL,NULL,NULL,'+32 2 555 0017','info@ordina.be','BE0456677889','Charlotte Desmet',NULL,NULL,NULL,NULL,'https://www.ordina.be',NULL,NULL,NULL,'[\"Bachelor Toegepaste Informatica\", \"Graduaat Programmeren\", \"Graduaat Systeem- & Netwerkbeheer\"]','$2b$12$OXAwnygSg3SHFBaXANrBV.U/b.zyuqEdJ4aggzag6DA9NnZUTn7K.','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica'),
(47,'Persolis',NULL,NULL,NULL,NULL,'+32 2 555 0018','info@persolis.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.persolis.be',NULL,NULL,NULL,NULL,'$2b$12$ppnv26eSm2mIMMOoS0/B7uWPWgLPZ0X3T4/ddJP.TohtqUl9TzMC6','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica'),
(48,'Proclus BV',NULL,NULL,NULL,NULL,'+32 2 555 0019','info@proclus.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.proclus.be',NULL,NULL,NULL,NULL,'$2b$12$nlSOftUlNavoNesEKkcwOeZeNt7LUzWWiX1W4Ck9YVpNMGwM4c5jK','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica'),
(49,'RP One',NULL,NULL,NULL,NULL,'+32 2 555 0020','info@rpone.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.rpone.be',NULL,NULL,NULL,NULL,'$2b$12$R8xsR231ft7xVY6B4Mrrz.cHe5oSS4i6FT.9e2lGiREVdMyVghUQC','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica'),
(50,'Safran Aircraft Engine Services Brussels',NULL,NULL,NULL,NULL,'+32 2 555 0021','info@safran.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.safran-group.com',NULL,NULL,NULL,NULL,'$2b$12$wKCq6w7ZMklq6MsEtXOFsOFk1rFqs8wIYF2fT6.XzMlTBUDHelR6O','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica, Graduaat Programmeren'),
(51,'Simac',NULL,NULL,NULL,NULL,'+32 2 555 0022','info@simac.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.simac.com',NULL,NULL,NULL,NULL,'$2b$12$SvlDQTi3BVPJcV9OuQ6GK.nfhY2auZeG0etzhNvzfJPBtX2fyrj/.','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica, Graduaat Programmeren, Graduaat Internet of Things'),
(52,'Smals',NULL,NULL,NULL,NULL,'+32 2 555 0023','info@smals.be',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.smals.be',NULL,NULL,NULL,NULL,'$2b$12$B8kKzk/AbZPTy1ASyw6dSuiHoW4ucdS0BBk13pmUvg0NaUetw3SQm','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica, Graduaat Programmeren, Graduaat Systeem- & Netwerkbeheer, Graduaat Internet of Things'),
(53,'Sopra Steria','Avenue Arnaud Fraiteur','15-23','1050','Ixelles','+32 2 208 72 72','info@soprasteria.be','BE0765544332','Tine Van Gucht',NULL,NULL,NULL,NULL,'https://www.soprasteria.be',NULL,NULL,NULL,'[\"Bachelor Toegepaste Informatica\", \"Graduaat Programmeren\", \"Graduaat Internet of Things\"]','$2b$12$ylbWWzW7IN9AuRUGyW7Oh.71Gb6TAHEbBHadQ8XipyHaNDocQ40Xe','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica, Graduaat Programmeren, Graduaat Internet of Things'),
(54,'SPIE ICS IT Talent Solutions SA','Route de Lennik','451','1070','Anderlecht','+32 2 559 59 59','info@spieics.be','BE0402400083','Dirk Goossens',NULL,NULL,NULL,NULL,'https://www.spie-ics.be',NULL,NULL,NULL,NULL,'$2b$12$JVLrCe/s4tU2XfcatQRzweLCVfnSp2oV1NxssvLv/WiPIBegNrXpW','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica'),
(55,'TheValueChain','Veldkant','33A','2550','Kontich','+32 3 871 95 00','info@thevaluechain.be','BE0839104080','Wim Vangeel',NULL,NULL,NULL,NULL,'https://www.thevaluechain.be',NULL,NULL,NULL,NULL,'$2b$12$wA4ETBh//dnnRCkAPSsFb.kW1XXQhgvJ0AnEvqmcO3oSHvkInzcfK','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica'),
(56,'Userfull','Koning Albertlaan','114','9000','Gent','+32 9 331 34 11','info@userfull.be','BE0765547733','Maarten De Wilde',NULL,NULL,NULL,NULL,'https://www.userfull.com',NULL,NULL,NULL,NULL,'$2b$12$Ft6u9fkaaBtCb1LZyRY7B.Xq/ZbjVbApWtnIpZC.kmxc16BzMtKRy','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica'),
(57,'UZ Brussel','Laarbeeklaan','101','1090','Jette','+32 2 477 41 11','info@uzbrussel.be','BE0432382063','Kristien Van Gucht',NULL,NULL,NULL,NULL,'https://www.uzbrussel.be',NULL,NULL,NULL,NULL,'$2b$12$Gbcg7WxYEO8t8zdNoUvJcO/a8Vioh5yRjSI6N3fzlKEh.JzfzEW.O','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica, Graduaat Programmeren'),
(58,'YPTO','Koloniënstraat','11','1000','Brussel','+32 2 525 75 75','info@ypto.be','BE0829299853','Joachim Michiels',NULL,NULL,NULL,NULL,'https://www.ypto.be',NULL,NULL,NULL,NULL,'$2b$12$NaEaSLNQTrh.D4sarG12O.aYtQSdqiCYUvaKxusZa.CQdN2dlK.P2','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica, Graduaat Systeem- & Netwerkbeheer'),
(59,'Yteria','Sint-Pietersvliet','7','2000','Antwerpen','+32 3 369 06 79','info@yteria.be','BE0847382912','Alexander De Vos',NULL,NULL,NULL,NULL,'https://www.yteria.com',NULL,NULL,NULL,NULL,'$2b$12$OtJ7/pttttYOjfXqKHgfi.d3GcIFGKgYS1/2hsSnC7WMwJwO9eFqG','[\"13:30\",\"13:45\",\"14:00\",\"14:15\",\"14:30\",\"14:45\",\"15:00\",\"15:15\",\"15:30\",\"15:45\",\"16:00\",\"16:15\"]',0,NULL,'Bachelor Toegepaste Informatica, Graduaat Programmeren, Graduaat Internet of Things');
/*!40000 ALTER TABLE `Bedrijven` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Nieuwsbrief_Abonnementen`
--

DROP TABLE IF EXISTS `Nieuwsbrief_Abonnementen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Nieuwsbrief_Abonnementen` (
  `abonnement_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `naam` varchar(255) DEFAULT NULL,
  `rol` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`abonnement_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Nieuwsbrief_Abonnementen`
--

LOCK TABLES `Nieuwsbrief_Abonnementen` WRITE;
/*!40000 ALTER TABLE `Nieuwsbrief_Abonnementen` DISABLE KEYS */;
INSERT INTO `Nieuwsbrief_Abonnementen` VALUES
(1,'bjornguiot@gmail.com','bjorn','student');
/*!40000 ALTER TABLE `Nieuwsbrief_Abonnementen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Sectoren`
--

DROP TABLE IF EXISTS `Sectoren`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Sectoren` (
  `sector_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `naam` varchar(100) NOT NULL,
  `zichtbaar` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`sector_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sectoren`
--

LOCK TABLES `Sectoren` WRITE;
/*!40000 ALTER TABLE `Sectoren` DISABLE KEYS */;
INSERT INTO `Sectoren` VALUES
(1,'Softwareontwikkeling',1),
(2,'Cybersecurity',1),
(3,'Cloud Computing',1),
(4,'Data-analyse & Big Data',1),
(5,'Netwerkbeheer',1);
/*!40000 ALTER TABLE `Sectoren` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Student_HardSkills`
--

DROP TABLE IF EXISTS `Student_HardSkills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Student_HardSkills` (
  `student_id` bigint(20) unsigned NOT NULL,
  `skill` varchar(100) NOT NULL,
  PRIMARY KEY (`student_id`,`skill`),
  CONSTRAINT `Student_HardSkills_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `Studenten` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Student_HardSkills`
--

LOCK TABLES `Student_HardSkills` WRITE;
/*!40000 ALTER TABLE `Student_HardSkills` DISABLE KEYS */;
/*!40000 ALTER TABLE `Student_HardSkills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Student_Programmeertalen`
--

DROP TABLE IF EXISTS `Student_Programmeertalen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Student_Programmeertalen` (
  `student_id` bigint(20) unsigned NOT NULL,
  `taal` varchar(100) NOT NULL,
  PRIMARY KEY (`student_id`,`taal`),
  CONSTRAINT `Student_Programmeertalen_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `Studenten` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Student_Programmeertalen`
--

LOCK TABLES `Student_Programmeertalen` WRITE;
/*!40000 ALTER TABLE `Student_Programmeertalen` DISABLE KEYS */;
/*!40000 ALTER TABLE `Student_Programmeertalen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Student_SoftSkills`
--

DROP TABLE IF EXISTS `Student_SoftSkills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Student_SoftSkills` (
  `student_id` bigint(20) unsigned NOT NULL,
  `skill` varchar(100) NOT NULL,
  PRIMARY KEY (`student_id`,`skill`),
  CONSTRAINT `Student_SoftSkills_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `Studenten` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Student_SoftSkills`
--

LOCK TABLES `Student_SoftSkills` WRITE;
/*!40000 ALTER TABLE `Student_SoftSkills` DISABLE KEYS */;
/*!40000 ALTER TABLE `Student_SoftSkills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Student_Talen`
--

DROP TABLE IF EXISTS `Student_Talen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Student_Talen` (
  `student_id` bigint(20) unsigned NOT NULL,
  `taal` varchar(100) NOT NULL,
  `niveau` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`student_id`,`taal`),
  CONSTRAINT `Student_Talen_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `Studenten` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Student_Talen`
--

LOCK TABLES `Student_Talen` WRITE;
/*!40000 ALTER TABLE `Student_Talen` DISABLE KEYS */;
/*!40000 ALTER TABLE `Student_Talen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Studenten`
--

DROP TABLE IF EXISTS `Studenten`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Studenten` (
  `student_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `wachtwoord` varchar(255) NOT NULL,
  `naam` varchar(255) NOT NULL,
  `studie` varchar(255) DEFAULT NULL,
  `foto_url` varchar(255) DEFAULT NULL,
  `linkedin_url` varchar(255) DEFAULT NULL,
  `github_url` varchar(255) DEFAULT NULL,
  `jobstudent` tinyint(1) DEFAULT NULL,
  `werkzoekend` tinyint(1) DEFAULT NULL,
  `stage_gewenst` tinyint(1) DEFAULT NULL,
  `telefoon` varchar(20) DEFAULT NULL,
  `aboutMe` text DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Studenten`
--

LOCK TABLES `Studenten` WRITE;
/*!40000 ALTER TABLE `Studenten` DISABLE KEYS */;
INSERT INTO `Studenten` VALUES
(1,'bjorn.guiot@student.ehb.be','$2b$10$hnUbpSngiqYsjQncUhAlLekgX3Vj/v2o0tmhxZNyb0Q3.QsbJk8Ya','Bjorn Guiot','TI',NULL,NULL,NULL,0,0,0,'0483586731',NULL),
(3,'roger.lendo-lokakema@student.ehb.be','$2b$10$75bZbSV96pP8brp4oV884u5Oq8A7lSexBbfqUkCqGZeqpeRLZlfuO','Roger','Toegepaste Informatica',NULL,NULL,NULL,0,0,0,NULL,'YO'),
(4,'CristianoRonaldo@student.ehb.be','$2b$10$l3adFLQ5CZuPlducTCkGBOHbuDkAdI9Kgv/VPjSAmV.JO9SMxK1j6','Ronaldo','Toegepaste Informatica',NULL,NULL,NULL,0,0,0,NULL,NULL),
(5,'SlechteSpeler@student.ehb.be','$2b$10$EVUCcBSBBVHm.rC0.IRZp.7M699EdqFqrgOwE3quEU/jIP0S7rTv2','Messi','Toegepaste Informatica',NULL,NULL,NULL,0,0,0,NULL,NULL),
(7,'simon.beelen@student.ehb.be','$2b$10$gFb0xpmPnqNzJ3/MalrHne/GgY51gW6AJjhmg1k1jhrepNFgcZbEG','Simon Beelen','TI',NULL,NULL,NULL,0,0,0,NULL,NULL),
(8,'simonbeelen@icloud.com','geheim123','Beelen',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(9,'lea.ceulemans@student.ehb.be','$2b$10$1pDETzme0TFgpOLY7PhyBuXZGJuljoeRPB.EycMlMj7N8AYvhn8XS','Léa Ceulemans','Communicatie',NULL,NULL,NULL,0,0,0,NULL,NULL);
/*!40000 ALTER TABLE `Studenten` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Werkzoekenden`
--

DROP TABLE IF EXISTS `Werkzoekenden`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Werkzoekenden` (
  `werkzoekende_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `wachtwoord` varchar(255) NOT NULL,
  `naam` varchar(255) DEFAULT NULL,
  `foto_url` varchar(255) DEFAULT NULL,
  `linkedin_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`werkzoekende_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Werkzoekenden`
--

LOCK TABLES `Werkzoekenden` WRITE;
/*!40000 ALTER TABLE `Werkzoekenden` DISABLE KEYS */;
INSERT INTO `Werkzoekenden` VALUES
(1,'test@test.be','$2b$10$uYYTnPJjJs5/dxfJeklxOOLQ.Yva.1PB3pxO//xUTx3Me/PHKE8QS','test',NULL,NULL),
(2,'simonbeelen@icloud.com','$2b$10$0IlgOqpfbu95rKsB5Q4ZTeDdYlUxanstCHu1DIYHwLqREWo8DoFmK','Simon',NULL,NULL);
/*!40000 ALTER TABLE `Werkzoekenden` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aanwezigheid`
--

DROP TABLE IF EXISTS `aanwezigheid`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `aanwezigheid` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `student_id` bigint(20) unsigned DEFAULT NULL,
  `werkzoekende_id` bigint(20) unsigned DEFAULT NULL,
  `gast_deelnemer_id` int(11) DEFAULT NULL,
  `deelnemer_type` enum('student','werkzoekende','gast') NOT NULL,
  `aanwezig_op` timestamp NULL DEFAULT current_timestamp(),
  `registratie_methode` enum('QR_CODE','MANUAL','OTHER') DEFAULT 'QR_CODE',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_attendance_per_event` (`event_id`,`student_id`,`werkzoekende_id`,`gast_deelnemer_id`),
  KEY `idx_event_attendance` (`event_id`),
  KEY `idx_student_attendance` (`student_id`),
  KEY `idx_werkzoekende_attendance` (`werkzoekende_id`),
  KEY `idx_gast_deelnemer_attendance` (`gast_deelnemer_id`),
  KEY `idx_deelnemer_type` (`deelnemer_type`),
  CONSTRAINT `aanwezigheid_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `evenementen` (`id`) ON DELETE CASCADE,
  CONSTRAINT `aanwezigheid_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `Studenten` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `aanwezigheid_ibfk_3` FOREIGN KEY (`werkzoekende_id`) REFERENCES `Werkzoekenden` (`werkzoekende_id`) ON DELETE CASCADE,
  CONSTRAINT `aanwezigheid_ibfk_4` FOREIGN KEY (`gast_deelnemer_id`) REFERENCES `gast_deelnemers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_deelnemer_type` CHECK (`deelnemer_type` = 'student' and `student_id` is not null and `werkzoekende_id` is null and `gast_deelnemer_id` is null or `deelnemer_type` = 'werkzoekende' and `student_id` is null and `werkzoekende_id` is not null and `gast_deelnemer_id` is null or `deelnemer_type` = 'gast' and `student_id` is null and `werkzoekende_id` is null and `gast_deelnemer_id` is not null)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aanwezigheid`
--

LOCK TABLES `aanwezigheid` WRITE;
/*!40000 ALTER TABLE `aanwezigheid` DISABLE KEYS */;
/*!40000 ALTER TABLE `aanwezigheid` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendees`
--

DROP TABLE IF EXISTS `attendees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `student_id` bigint(20) unsigned DEFAULT NULL,
  `werkzoekende_id` bigint(20) unsigned DEFAULT NULL,
  `gast_deelnemer_id` int(11) DEFAULT NULL,
  `deelnemer_type` enum('student','werkzoekende','gast') NOT NULL,
  `status` enum('expected','checked_in','absent','cancelled') NOT NULL DEFAULT 'expected',
  `last_updated` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_attendee_per_event` (`event_id`,`student_id`,`werkzoekende_id`,`gast_deelnemer_id`),
  KEY `idx_attendee_event` (`event_id`),
  KEY `idx_attendee_student` (`student_id`),
  KEY `idx_attendee_werkzoekende` (`werkzoekende_id`),
  KEY `idx_attendee_gast_deelnemer` (`gast_deelnemer_id`),
  KEY `idx_deelnemer_type` (`deelnemer_type`),
  KEY `idx_attendee_status` (`status`),
  CONSTRAINT `attendees_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `evenementen` (`id`) ON DELETE CASCADE,
  CONSTRAINT `attendees_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `Studenten` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `attendees_ibfk_3` FOREIGN KEY (`werkzoekende_id`) REFERENCES `Werkzoekenden` (`werkzoekende_id`) ON DELETE CASCADE,
  CONSTRAINT `attendees_ibfk_4` FOREIGN KEY (`gast_deelnemer_id`) REFERENCES `gast_deelnemers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_attendee_deelnemer_type` CHECK (`deelnemer_type` = 'student' and `student_id` is not null and `werkzoekende_id` is null and `gast_deelnemer_id` is null or `deelnemer_type` = 'werkzoekende' and `student_id` is null and `werkzoekende_id` is not null and `gast_deelnemer_id` is null or `deelnemer_type` = 'gast' and `student_id` is null and `werkzoekende_id` is null and `gast_deelnemer_id` is not null)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendees`
--

LOCK TABLES `attendees` WRITE;
/*!40000 ALTER TABLE `attendees` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `checkins`
--

DROP TABLE IF EXISTS `checkins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `checkins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `type` enum('student','werkzoekende','gast','bezoeker') NOT NULL,
  `status` enum('checked_in','cancelled') NOT NULL DEFAULT 'checked_in',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checkins`
--

LOCK TABLES `checkins` WRITE;
/*!40000 ALTER TABLE `checkins` DISABLE KEYS */;
INSERT INTO `checkins` VALUES
(2,'Nolween Sine','nolweensine7@gmail.com','bezoeker','checked_in','2025-06-18 08:24:58');
/*!40000 ALTER TABLE `checkins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evenementen`
--

DROP TABLE IF EXISTS `evenementen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `evenementen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `naam` varchar(255) NOT NULL,
  `beschrijving` text DEFAULT NULL,
  `datum` date NOT NULL,
  `tijd` time DEFAULT NULL,
  `locatie` varchar(255) DEFAULT NULL,
  `max_deelnemers` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evenementen`
--

LOCK TABLES `evenementen` WRITE;
/*!40000 ALTER TABLE `evenementen` DISABLE KEYS */;
/*!40000 ALTER TABLE `evenementen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_qr_codes`
--

DROP TABLE IF EXISTS `event_qr_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_qr_codes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `qr_token` varchar(32) NOT NULL,
  `qr_data_url` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `qr_token` (`qr_token`),
  UNIQUE KEY `unique_event_qr` (`event_id`),
  KEY `idx_qr_token` (`qr_token`),
  CONSTRAINT `event_qr_codes_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `evenementen` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_qr_codes`
--

LOCK TABLES `event_qr_codes` WRITE;
/*!40000 ALTER TABLE `event_qr_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_qr_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gast_deelnemers`
--

DROP TABLE IF EXISTS `gast_deelnemers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `gast_deelnemers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `naam` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gast_deelnemers`
--

LOCK TABLES `gast_deelnemers` WRITE;
/*!40000 ALTER TABLE `gast_deelnemers` DISABLE KEYS */;
/*!40000 ALTER TABLE `gast_deelnemers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plattegrond`
--

DROP TABLE IF EXISTS `plattegrond`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `plattegrond` (
  `plaats_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('tafel','aula') NOT NULL,
  `nummer` int(11) NOT NULL,
  `bedrijf_id` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`plaats_id`),
  KEY `fk_plat_bedrijf` (`bedrijf_id`),
  CONSTRAINT `fk_plat_bedrijf` FOREIGN KEY (`bedrijf_id`) REFERENCES `Bedrijven` (`bedrijf_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plattegrond`
--

LOCK TABLES `plattegrond` WRITE;
/*!40000 ALTER TABLE `plattegrond` DISABLE KEYS */;
INSERT INTO `plattegrond` VALUES
(1,'tafel',1,NULL),
(2,'tafel',2,NULL),
(3,'tafel',3,NULL),
(4,'tafel',4,NULL),
(5,'tafel',5,NULL),
(6,'tafel',6,NULL),
(7,'tafel',7,NULL),
(8,'tafel',8,NULL),
(9,'tafel',9,NULL),
(10,'tafel',10,NULL),
(11,'tafel',11,NULL),
(12,'tafel',12,NULL),
(13,'tafel',13,NULL),
(14,'tafel',14,NULL),
(15,'tafel',15,NULL),
(16,'tafel',16,NULL),
(17,'aula',1,NULL),
(18,'aula',2,NULL),
(19,'aula',3,NULL),
(20,'aula',4,NULL);
/*!40000 ALTER TABLE `plattegrond` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visits`
--

DROP TABLE IF EXISTS `visits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `visits` (
  `visit_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `visitor_id` bigint(20) unsigned NOT NULL,
  `visitor_type` varchar(50) NOT NULL,
  `bedrijf_id` bigint(20) unsigned NOT NULL,
  `visit_timestamp` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`visit_id`),
  KEY `fk_bedrijf` (`bedrijf_id`),
  CONSTRAINT `fk_bedrijf` FOREIGN KEY (`bedrijf_id`) REFERENCES `Bedrijven` (`bedrijf_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visits`
--

LOCK TABLES `visits` WRITE;
/*!40000 ALTER TABLE `visits` DISABLE KEYS */;
/*!40000 ALTER TABLE `visits` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-19 11:29:32

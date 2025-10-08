CREATE DATABASE  IF NOT EXISTS `vinocostero` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `vinocostero`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: vinocostero
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `catas`
--

DROP TABLE IF EXISTS `catas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lote_id` int NOT NULL,
  `puntaje` int NOT NULL,
  `notas` text COLLATE utf8mb4_unicode_ci,
  `fecha` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `lote_id` (`lote_id`),
  CONSTRAINT `catas_ibfk_1` FOREIGN KEY (`lote_id`) REFERENCES `lotes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catas`
--

LOCK TABLES `catas` WRITE;
/*!40000 ALTER TABLE `catas` DISABLE KEYS */;
INSERT INTO `catas` VALUES (1,1,92,'Notas cítricas y floraless','2025-10-07'),(2,3,95,'Alta calidad','2025-10-08');
/*!40000 ALTER TABLE `catas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lotes`
--

DROP TABLE IF EXISTS `lotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lotes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parcela_id` int NOT NULL,
  `anio` int NOT NULL,
  `fecha_cosecha` date DEFAULT NULL,
  `cantidad_litros` decimal(10,2) DEFAULT NULL,
  `notas` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`),
  KEY `parcela_id` (`parcela_id`),
  KEY `anio` (`anio`),
  CONSTRAINT `lotes_ibfk_1` FOREIGN KEY (`parcela_id`) REFERENCES `parcelas` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lotes`
--

LOCK TABLES `lotes` WRITE;
/*!40000 ALTER TABLE `lotes` DISABLE KEYS */;
INSERT INTO `lotes` VALUES (1,'L-2025-001',1,2025,NULL,NULL,NULL),(2,'L-2025-002',2,2025,NULL,NULL,NULL),(3,'L-2025-003',2,2025,NULL,NULL,NULL);
/*!40000 ALTER TABLE `lotes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parcelas`
--

DROP TABLE IF EXISTS `parcelas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parcelas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hectareas` decimal(5,2) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parcelas`
--

LOCK TABLES `parcelas` WRITE;
/*!40000 ALTER TABLE `parcelas` DISABLE KEYS */;
INSERT INTO `parcelas` VALUES (1,'Parcela A-2025',2.50,1,'2025-10-07 21:28:42'),(2,'Parcela B-2025',1.80,1,'2025-10-07 21:28:42');
/*!40000 ALTER TABLE `parcelas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `siembras`
--

DROP TABLE IF EXISTS `siembras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `siembras` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parcela_id` int NOT NULL,
  `tipo_uva_id` int NOT NULL,
  `fecha` date NOT NULL,
  `responsable` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `parcela_id` (`parcela_id`),
  KEY `tipo_uva_id` (`tipo_uva_id`),
  CONSTRAINT `siembras_ibfk_1` FOREIGN KEY (`parcela_id`) REFERENCES `parcelas` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `siembras_ibfk_2` FOREIGN KEY (`tipo_uva_id`) REFERENCES `tipos_uva` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `siembras`
--

LOCK TABLES `siembras` WRITE;
/*!40000 ALTER TABLE `siembras` DISABLE KEYS */;
INSERT INTO `siembras` VALUES (1,1,1,'2025-10-07','Ing. Agrónomo 1'),(2,2,2,'2025-10-07','Ing. Agrónomo 2');
/*!40000 ALTER TABLE `siembras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `siembras_enfermedad`
--

DROP TABLE IF EXISTS `siembras_enfermedad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `siembras_enfermedad` (
  `id` int NOT NULL AUTO_INCREMENT,
  `siembra_id` int NOT NULL,
  `tipo` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `severidad` enum('Baja','Media','Alta') COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha` date NOT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `siembra_id` (`siembra_id`),
  CONSTRAINT `siembras_enfermedad_ibfk_1` FOREIGN KEY (`siembra_id`) REFERENCES `siembras` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `siembras_enfermedad`
--

LOCK TABLES `siembras_enfermedad` WRITE;
/*!40000 ALTER TABLE `siembras_enfermedad` DISABLE KEYS */;
INSERT INTO `siembras_enfermedad` VALUES (1,1,'Mildew','Media','2025-10-08','Peligro');
/*!40000 ALTER TABLE `siembras_enfermedad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_uva`
--

DROP TABLE IF EXISTS `tipos_uva`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_uva` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_uva`
--

LOCK TABLES `tipos_uva` WRITE;
/*!40000 ALTER TABLE `tipos_uva` DISABLE KEYS */;
INSERT INTO `tipos_uva` VALUES (1,'Sauvignon Blanc','SBL'),(2,'Chardonnay','CHD'),(3,'Merlot','3');
/*!40000 ALTER TABLE `tipos_uva` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` enum('admin','visor') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'visor',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Admin','admin@vc.com','$2b$10$oRAjiUo0MfDyFcSwuZXVOuGpkXFZWTLB/HBlZIxR99vG03y/VrIgO','admin','2025-10-07 21:28:42'),(2,'Visor','visor@vc.com','$2b$10$zBJY4LPT3ueQNzJNRyxv8eVU3NJFPZaTr/OqKg1zFSBikm/wlxqa.','visor','2025-10-07 21:28:42');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'vinocostero'
--

--
-- Dumping routines for database 'vinocostero'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-07 18:35:18

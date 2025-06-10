-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 06, 2025 at 06:11 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `careerlaunch`
--

-- --------------------------------------------------------

--
-- Table structure for table `bedrijven`
--

CREATE TABLE `bedrijven` (
  `id` int(11) NOT NULL,
  `bedrijfsnaam` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `sector` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bedrijven`
--

INSERT INTO `bedrijven` (`id`, `bedrijfsnaam`, `email`, `sector`) VALUES
(1, 'test', 'test@test', 'testetst');

-- --------------------------------------------------------

--
-- Table structure for table `booth_locations`
--

CREATE TABLE `booth_locations` (
  `booth_id` int(11) NOT NULL,
  `location_code` varchar(50) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booth_locations`
--

INSERT INTO `booth_locations` (`booth_id`, `location_code`, `description`) VALUES
(1, 'A1', 'Hoofdhal, hoek links'),
(2, 'B2', 'Hoofdhal, midden');

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `company_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `company_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `booth_location` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`company_id`, `user_id`, `company_name`, `description`, `logo_url`, `contact_person`, `phone`, `email`, `booth_location`, `created_at`, `updated_at`) VALUES
(1, 2, 'Bedrijf A', 'We leveren innovatieve tech-oplossingen.', 'https://example.com/logo.png', 'Pieter Contact', '0687654321', 'contact@bedrijfa.nl', 'A1', '2025-06-05 12:32:06', '2025-06-05 12:32:06'),
(2, NULL, 'Google', 'Zoekmachine en marktleider in AI en cloudoplossingen.', 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', 'Ruben Bakker', '0622222222', 'info@google.com', 'A2', '2025-06-05 07:10:00', '2025-06-06 07:41:38'),
(3, NULL, 'Amazon Web Services', 'Cloud computing platform voor bedrijven.', 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg', 'Emma de Boer', '0633333333', 'aws-support@amazon.com', 'A3', '2025-06-05 07:20:00', '2025-06-06 07:41:38'),
(4, NULL, 'IBM', 'Enterprise software, cloud en quantum computing.', 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg', 'Tom Jansen', '0644444444', 'info@ibm.com', 'B1', '2025-06-05 07:30:00', '2025-06-06 07:41:38'),
(5, NULL, 'SAP', 'ERP-software en zakelijke oplossingen.', 'https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg', 'Lisa Hendriks', '0655555555', 'sales@sap.com', 'B2', '2025-06-05 07:40:00', '2025-06-06 07:41:38'),
(6, NULL, 'Oracle', 'Cloud-applicaties en databaseoplossingen.', 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg', 'Bastiaan Meijer', '0666666666', 'oracle-nl@oracle.com', 'B3', '2025-06-05 07:50:00', '2025-06-06 07:41:38'),
(7, NULL, 'Cisco', 'Netwerkhardware, telecom en beveiliging.', 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Cisco_logo_blue_2016.svg', 'Nina Peters', '0677777777', 'contact@cisco.com', 'C1', '2025-06-05 08:00:00', '2025-06-06 07:41:38'),
(8, NULL, 'Intel', 'Chipontwerp en geavanceerde technologie.', 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel-logo.svg', 'Daan Willems', '0688888888', 'info@intel.com', 'C2', '2025-06-05 08:10:00', '2025-06-06 07:41:38'),
(9, NULL, 'Adobe', 'Creatieve software en digitale ervaringstechnologie.', 'https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Corporate_Logo.png', 'Lotte Visser', '0699999999', 'support@adobe.com', 'C3', '2025-06-05 08:20:00', '2025-06-06 07:41:38'),
(10, NULL, 'Capgemini', 'Consultancy en technologieoplossingen voor bedrijven.', 'https://upload.wikimedia.org/wikipedia/commons/d/db/Capgemini_201x_logo.svg', 'Joost van Dam', '0601010101', 'nl@capgemini.com', 'D1', '2025-06-05 08:30:00', '2025-06-06 07:41:38');

-- --------------------------------------------------------

--
-- Table structure for table `company_booths`
--

CREATE TABLE `company_booths` (
  `company_id` int(11) NOT NULL,
  `booth_id` int(11) DEFAULT NULL,
  `reserved_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company_booths`
--

INSERT INTO `company_booths` (`company_id`, `booth_id`, `reserved_at`) VALUES
(1, 1, '2025-06-05 12:32:06');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `message_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `newsletter_subscribers`
--

CREATE TABLE `newsletter_subscribers` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `naam` varchar(255) DEFAULT NULL,
  `date_subscribed` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `newsletter_subscribers`
--

INSERT INTO `newsletter_subscribers` (`id`, `email`, `naam`, `date_subscribed`) VALUES
(1, 'le@gmail.com', 'le', '2025-06-06 15:40:23');

-- --------------------------------------------------------

--
-- Table structure for table `speeddates`
--

CREATE TABLE `speeddates` (
  `speeddates_id` int(11) NOT NULL,
  `visitor_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `date_time` datetime NOT NULL,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `speeddates`
--

INSERT INTO `speeddates` (`speeddates_id`, `visitor_id`, `company_id`, `date_time`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2025-07-01 10:00:00', 'confirmed', '2025-06-05 12:32:06', '2025-06-05 12:32:06');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `naam` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `studie` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `naam`, `email`, `studie`) VALUES
(1, 'bjorn guiot', 'bjornguiot@gmail.com', 'Toegepaste Informatica');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('visitor','company','admin') NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `password_hash`, `role`, `name`, `created_at`, `updated_at`) VALUES
(1, 'visitor1@example.com', 'hash1', 'visitor', 'Jan Visitor', '2025-06-05 12:32:06', '2025-06-05 12:32:06'),
(2, 'company1@example.com', 'hash2', 'company', 'Bedrijf A', '2025-06-05 12:32:06', '2025-06-05 12:32:06'),
(3, 'admin1@example.com', 'hash3', 'admin', 'Admin User', '2025-06-05 12:32:06', '2025-06-05 12:32:06');

-- --------------------------------------------------------

--
-- Table structure for table `visitor_profiles`
--

CREATE TABLE `visitor_profiles` (
  `visitor_id` int(11) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `preferences` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `visitor_profiles`
--

INSERT INTO `visitor_profiles` (`visitor_id`, `phone`, `preferences`) VALUES
(1, '0612345678', 'Voorkeuren: Tech, Finance');

-- --------------------------------------------------------

--
-- Table structure for table `werkzoekende`
--

CREATE TABLE `werkzoekende` (
  `id` int(11) NOT NULL,
  `naam` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `vaardigheden` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `werkzoekende`
--

INSERT INTO `werkzoekende` (`id`, `naam`, `email`, `vaardigheden`) VALUES
(1, 'Jason', 'jason@gmail.com', 'll'),
(2, 'test', 'test@test', 'test');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bedrijven`
--
ALTER TABLE `bedrijven`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `booth_locations`
--
ALTER TABLE `booth_locations`
  ADD PRIMARY KEY (`booth_id`),
  ADD UNIQUE KEY `location_code` (`location_code`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`company_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `company_booths`
--
ALTER TABLE `company_booths`
  ADD PRIMARY KEY (`company_id`),
  ADD UNIQUE KEY `booth_id` (`booth_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `speeddates`
--
ALTER TABLE `speeddates`
  ADD PRIMARY KEY (`speeddates_id`),
  ADD KEY `visitor_id` (`visitor_id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `visitor_profiles`
--
ALTER TABLE `visitor_profiles`
  ADD PRIMARY KEY (`visitor_id`);

--
-- Indexes for table `werkzoekende`
--
ALTER TABLE `werkzoekende`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bedrijven`
--
ALTER TABLE `bedrijven`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `booth_locations`
--
ALTER TABLE `booth_locations`
  MODIFY `booth_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `company_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `speeddates`
--
ALTER TABLE `speeddates`
  MODIFY `speeddates_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `werkzoekende`
--
ALTER TABLE `werkzoekende`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `companies`
--
ALTER TABLE `companies`
  ADD CONSTRAINT `companies_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `company_booths`
--
ALTER TABLE `company_booths`
  ADD CONSTRAINT `company_booths_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `company_booths_ibfk_2` FOREIGN KEY (`booth_id`) REFERENCES `booth_locations` (`booth_id`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `speeddates`
--
ALTER TABLE `speeddates`
  ADD CONSTRAINT `speeddates_ibfk_1` FOREIGN KEY (`visitor_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `speeddates_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE CASCADE;

--
-- Constraints for table `visitor_profiles`
--
ALTER TABLE `visitor_profiles`
  ADD CONSTRAINT `visitor_profiles_ibfk_1` FOREIGN KEY (`visitor_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

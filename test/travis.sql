create 'belink'@'localhost' identified by 'belink';
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP ON *.* TO 'belink'@'localhost';

CREATE DATABASE IF NOT EXISTS `belink_test` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

USE `belink`;


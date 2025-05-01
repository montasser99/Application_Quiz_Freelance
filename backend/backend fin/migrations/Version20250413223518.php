<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250413223518 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE affect_user_quiz (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, quiz_id INT NOT NULL, date_affectation DATETIME NOT NULL, is_completed TINYINT(1) DEFAULT 0 NOT NULL, INDEX IDX_1D278B39A76ED395 (user_id), INDEX IDX_1D278B39853CD175 (quiz_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE affect_user_quiz ADD CONSTRAINT FK_1D278B39A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE affect_user_quiz ADD CONSTRAINT FK_1D278B39853CD175 FOREIGN KEY (quiz_id) REFERENCES quiz (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE affect_user_quiz DROP FOREIGN KEY FK_1D278B39A76ED395');
        $this->addSql('ALTER TABLE affect_user_quiz DROP FOREIGN KEY FK_1D278B39853CD175');
        $this->addSql('DROP TABLE affect_user_quiz');
    }
}

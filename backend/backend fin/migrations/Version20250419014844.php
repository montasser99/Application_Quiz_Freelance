<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250419014844 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE langages ADD deleted TINYINT(1) DEFAULT 0 NOT NULL');
        $this->addSql('ALTER TABLE question ADD deleted TINYINT(1) DEFAULT 0 NOT NULL');
        $this->addSql('ALTER TABLE quiz ADD deleted TINYINT(1) DEFAULT 0 NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE langages DROP deleted');
        $this->addSql('ALTER TABLE question DROP deleted');
        $this->addSql('ALTER TABLE quiz DROP deleted');
    }
}

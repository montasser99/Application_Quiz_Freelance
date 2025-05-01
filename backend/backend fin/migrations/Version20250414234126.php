<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250414234126 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_answer DROP FOREIGN KEY FK_BF8F5118DD31CF7F');
        $this->addSql('ALTER TABLE user_answer ADD answered_at DATETIME NOT NULL');
        $this->addSql('ALTER TABLE user_answer ADD CONSTRAINT FK_BF8F5118DD31CF7F FOREIGN KEY (user_quiz_id) REFERENCES affect_user_quiz (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_answer DROP FOREIGN KEY FK_BF8F5118DD31CF7F');
        $this->addSql('ALTER TABLE user_answer DROP answered_at');
        $this->addSql('ALTER TABLE user_answer ADD CONSTRAINT FK_BF8F5118DD31CF7F FOREIGN KEY (user_quiz_id) REFERENCES user_quiz (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
    }
}

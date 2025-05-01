<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250415023009 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_answer DROP FOREIGN KEY FK_BF8F51183101E51F');
        $this->addSql('ALTER TABLE user_answer DROP FOREIGN KEY FK_BF8F5118DD31CF7F');
        $this->addSql('DROP TABLE user_answer');
        $this->addSql('ALTER TABLE user_quiz ADD user_answer JSON DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_answer (id INT AUTO_INCREMENT NOT NULL, user_quiz_id INT NOT NULL, quiz_question_id INT NOT NULL, answer VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, is_correct TINYINT(1) NOT NULL, answered_at DATETIME NOT NULL, INDEX IDX_BF8F5118DD31CF7F (user_quiz_id), INDEX IDX_BF8F51183101E51F (quiz_question_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE user_answer ADD CONSTRAINT FK_BF8F51183101E51F FOREIGN KEY (quiz_question_id) REFERENCES quiz_question (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE user_answer ADD CONSTRAINT FK_BF8F5118DD31CF7F FOREIGN KEY (user_quiz_id) REFERENCES affect_user_quiz (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE user_quiz DROP user_answer');
    }
}

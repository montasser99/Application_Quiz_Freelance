<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250414230241 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_answer (id INT AUTO_INCREMENT NOT NULL, user_quiz_id INT NOT NULL, quiz_question_id INT NOT NULL, answer VARCHAR(255) NOT NULL, is_correct TINYINT(1) NOT NULL, INDEX IDX_BF8F5118DD31CF7F (user_quiz_id), INDEX IDX_BF8F51183101E51F (quiz_question_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_answer ADD CONSTRAINT FK_BF8F5118DD31CF7F FOREIGN KEY (user_quiz_id) REFERENCES user_quiz (id)');
        $this->addSql('ALTER TABLE user_answer ADD CONSTRAINT FK_BF8F51183101E51F FOREIGN KEY (quiz_question_id) REFERENCES quiz_question (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_answer DROP FOREIGN KEY FK_BF8F5118DD31CF7F');
        $this->addSql('ALTER TABLE user_answer DROP FOREIGN KEY FK_BF8F51183101E51F');
        $this->addSql('DROP TABLE user_answer');
    }
}

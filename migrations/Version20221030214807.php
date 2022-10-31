<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20221030214807 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TEMPORARY TABLE __temp__score AS SELECT id, player, number_of_tracks, points FROM score');
        $this->addSql('DROP TABLE score');
        $this->addSql('CREATE TABLE score (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, player VARCHAR(50) NOT NULL, number_of_tracks INTEGER NOT NULL, points INTEGER NOT NULL)');
        $this->addSql('INSERT INTO score (id, player, number_of_tracks, points) SELECT id, player, number_of_tracks, points FROM __temp__score');
        $this->addSql('DROP TABLE __temp__score');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_3299375198197A65 ON score (player)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TEMPORARY TABLE __temp__score AS SELECT id, player, number_of_tracks, points FROM score');
        $this->addSql('DROP TABLE score');
        $this->addSql('CREATE TABLE score (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, player VARCHAR(50) NOT NULL, number_of_tracks INTEGER NOT NULL, points INTEGER NOT NULL)');
        $this->addSql('INSERT INTO score (id, player, number_of_tracks, points) SELECT id, player, number_of_tracks, points FROM __temp__score');
        $this->addSql('DROP TABLE __temp__score');
    }
}

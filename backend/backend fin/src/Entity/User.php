<?php

namespace App\Entity;

use App\Enum\UserRole;
use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: 'user')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string')]
    private ?string $password = null;

    #[ORM\Column(type: 'string', length: 255)]
    private ?string $username = null;

    #[ORM\Column(type: 'string', length: 180, unique: true)]
    private ?string $email = null;
    

    #[ORM\Column(type: 'string', enumType: \App\Enum\UserRole::class, options: ['default' => 'ROLE_USER'])]
    private UserRole $role = UserRole::ROLE_USER;
    
    #[ORM\Column(type: 'integer', options: ['default' => 0])]
    private int $points_total_all = 0;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $date_creation;

    public function __construct()
    {
        $this->date_creation = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;
        return $this;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;
        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getRole(): UserRole
    {
        return $this->role;
    }
    

    public function setRole(UserRole $role): static
    {
        $this->role = $role;
        return $this;
    }

    public function getPointsTotalAll(): int
    {
        return $this->points_total_all;
    }

    public function setPointsTotalAll(int $points): static
    {
        $this->points_total_all = $points;
        return $this;
    }

    public function getDateCreation(): \DateTimeInterface
    {
        return $this->date_creation;
    }

    public function setDateCreation(\DateTimeInterface $date): static
    {
        $this->date_creation = $date;
        return $this;
    }

    public function getUserIdentifier(): string
    {
        return $this->email ?? '';
    }

    public function getRoles(): array
    {
        return [$this->role];
    }

    public function eraseCredentials(): void
    {
        // Pour effacer des infos sensibles temporaires
    }
}

<?php

namespace App\Controller\Admin;

use App\Entity\Track;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class TrackCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Track::class;
    }

    /*
    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id'),
            TextField::new('title'),
            TextEditorField::new('description'),
        ];
    }
    */
}

<?php

namespace App\DQL;

use Doctrine\ORM\Query\AST\Functions\FunctionNode;
use Doctrine\ORM\Query\AST\SimpleArithmeticExpression;
use Doctrine\ORM\Query\Lexer;

class Random extends FunctionNode
{
    /**
     * @var SimpleArithmeticExpression
     */
    private $expression = null;

    public function getSql(\Doctrine\ORM\Query\SqlWalker $sqlWalker): string
    {
        if ($this->expression) {
            return 'RANDOM(' . $this->expression->dispatch($sqlWalker) . ')';
        }

        return 'RANDOM()';
    }

    public function parse(\Doctrine\ORM\Query\Parser $parser): void
    {
        $lexer = $parser->getLexer();
        $parser->match(Lexer::T_IDENTIFIER);
        $parser->match(Lexer::T_OPEN_PARENTHESIS);

        if (Lexer::T_CLOSE_PARENTHESIS !== $lexer->lookahead['type']) {
            $this->expression = $parser->SimpleArithmeticExpression();
        }

        $parser->match(Lexer::T_CLOSE_PARENTHESIS);
    }
}

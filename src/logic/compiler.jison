123123
%lex
%%
\s+                                                             /*skip*/
[tT][rR][uU][eE]                                                return 'true';
[fF][aA][lL][sS][eE]                                            return 'false';
[0-9]+(\.[0-9]+)?                                               return 'num';
","|"，"                                                        return ',';
"("|"（"                                                        return '(';
")"|"）"                                                        return ')';
("-"|"="|">")+?">"|"→"                                          return yytext='→';
"iff"|"<"("-"|"=")?">"|"↔"                                      return yytext='↔';
([aA][nN][dD])|("&"+)|"∧"                                       return yytext='∧';
([oO][rR])|("|"+)|"∨"                                           return yytext='∨';
([nN][oO][tT])|"!"|"！"|"﹁"                                     return yytext='﹁';
(\w|[\u4e00-\u9fa5]|";"|"；")+                                   return 'identifier';
/lex

%start res
%nonassoc  '↔' '→'
%left '∨'
%left '∧'
%right '﹁'
%right '(' '['
%left ')' ']'

%{
    import {True, False, AtomicProposition, Negation, Conjunction, Disjunction, IFF, Implication} from '@/logic/formula/well-formed';
%}

%%
p:
    'identifier'    {$$ = new AtomicProposition($1);}
    |'true'         {$$ = new True();}
    |'false'        {$$ = new False();}
    ;
exp:
    p
    |'﹁' exp        {$$ = new Negation($2);}
    |exp '→' exp    {$$ = new Implication($1,$3);}
    |exp '↔' exp    {$$ = new IFF($1,$3);}
    |exp '∨' exp    {
        let disjuncts = [];
        if($1 instanceof Disjunction && $1.enclosed===undefined){
            $1.disjuncts.forEach(disjunct=>{
               disjuncts.push(disjunct);
            });
        }else{
            disjuncts.push($1);
        }
        if($3 instanceof Disjunction && $3.enclosed===undefined){
            $3.disjuncts.forEach(disjunct=>{
                disjuncts.push(disjunct);
            });
        }else{
            disjuncts.push($3);
        }
        $$ = new Disjunction(...disjuncts);
    }
    |exp '∧' exp    {
        let conjuncts = [];
        if($1 instanceof Conjunction && $1.enclosed === undefined){
            $1.conjuncts.forEach(conjunct=>{
                conjuncts.push(conjunct);
            });
        }else{
            conjuncts.push($1);
        }
        if($3 instanceof Conjunction && $3.enclosed === undefined){
            $3.conjuncts.forEach(conjunct=>{
                conjuncts.push(conjunct);
            });
        }else{
            conjuncts.push($3);
        }
        $$ = new Conjunction(...conjuncts);
    }
    |'(' exp ')'    {$2.enclosed = true;$$ = $2;}
    ;
res:
    exp     {return $$=$1;}
    ;
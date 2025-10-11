>25*::"HyperJump",,,,,,,,,,48*,25*,:"Press any key to jump!",,,,,,,,,,,,,,,,,,,,48*,25*,v
v"Game by Cal Flynn"0                                                                   <
>"Score: ",:.48*,25*,:"Lives: ",:.48*,25*,                                             v
^                                                                                       <
v"Player: [@] Obstacles: [#] Ground: [=]"0                                            
>"Use any key to jump over obstacles!",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,48*,25*,    v
^                                                                                       <
v                                                                                      
>$55+*:00p10p20p30p40p                    v Initialize game variables
v p05:*+55$ <                            
>:10g-#v_$25*,:"Game Over! Score: ",00g:.48*,25*,:"Press 'r' to restart",,,,,,,,,,,,@
        >20g1+:20p:#v_                    v Game loop
                    >30g1+:30p40g1+:40p   v Update score and obstacle position  
                    v                     <
                    >40g79-!#v_40g0:40p   v Reset obstacle if off screen
                             >           ^
                    v                     
                    >10g19-!#v_           v Check if player is jumping
                             >10g1-:10p  v Decrease jump height
                    ^                     <
                    v                     
                    >40g15-10g20-*!#v_    v Collision detection (simple)
                                   >10g1+:10p25*,:"JUMP!",,,,48*v Game over if collision
                    ^                                          <
                    v                                          
                    >                                          v Continue game
                    v"                                        "<
                    >"[@]",40g' :!#v_'#,                       v Draw player and obstacles
                             >' ,                              <
                    ^                                          
                    v"                                        "<
                    >"===========================================",48*,25*v Draw ground
                    ^                                                     <
                    v                                                     
                    >~:114*-!#v_10g8+:10p                                v Get input, if 'r' restart
                             >~:*84-!#v_                                  < if any other key, jump
                    ^                   <                                
                    v                                                     
                    >                                           ^        v Main game loop
                    ^                                           <        
@
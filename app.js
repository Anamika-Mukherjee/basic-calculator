
//select all buttons, calculator display, number buttons and operator buttons
let btns = document.querySelectorAll(".calc-btn");
let screen = document.querySelector("#calc-screen");
let numBtns = document.querySelectorAll(".num-btn");
let operatorBtns = document.querySelectorAll(".oper-btn");

//initialize result and variable to check if error is thrown 
let result = 0.0; 
let isError = false;

//create arrays for numbers and operators
let numberSymbols = ["0", "1", "2", "3", "4", "5", "6", "7", "8" ,"9"];
let operatorSymbols = ["+", "-", "*", "/"];

//initialize button press status of decimal button, percent button, equal button, sign button and operator buttons
let isDecimalPressed = false;
let isPercentPressed = false;
let isEqualPressed = false;
let isSignPressed = true;
let isOperatorPressed = true;

//declare arrays for storing indices of signed values
let signIndex = [];
let signBracketIndex = [];

//declare variables to keep count of opening and closing brackets
let bracketOpenCount = 0;
let bracketCloseCount = 0;

//initialize display to blank screen
screen.textContent = ""; 


//function to clear the display and reset all variables to the initial values
function clearScreen(){

    //clear the display
    screen.textContent = "";
 
    //reset all variables to their initial values 
    isDecimalPressed = false;
    isSignPressed = true;
    isOperatorPressed = true;
    isPercentPressed = false;
    isEqualPressed = false;
    bracketOpenCount =0;
    bracketCloseCount = 0; 
    signBracketIndex = [];
    signIndex = []; 
}

//function to clear last entry
function clearEntry(lastChar){

    //initialize variables to keep count of opening and closing brackets
    let openCount = 0;
    let closeCount =0;

    //check if 'equal' button is not pressed; the character will be deleted only if 'equal' button is not pressed 
    if(!isEqualPressed){

        //clear screen if display string contains only 1 character
        if(screen.textContent.length === 1){
            clearScreen();
        }
  
        //if the display string contains more than 1 character
        else{
            //check if last character is an operator
            for(let operatorSymbol of operatorSymbols){
                if(lastChar === operatorSymbol){
                    //ensure an operator can be entered after deletion
                    isOperatorPressed = false;  
                }
            }
            //check if last character is a decimal point
            if(lastChar === "."){
            //ensure that a ".", an operator or a "%" can be entered after deletion
                isDecimalPressed = false;
                isOperatorPressed = false;
                isPercentPressed = false;
            }
            //check if last character is "%" 
            else if(lastChar === "%"){
                //ensure that "%" can be entered after deletion
                isPercentPressed = false;
            }
            //check if last character is a "("
            else if(lastChar === "("){
                //decrement the count of opening brackets by 1
                bracketOpenCount--;   
            }
            //check if last character is a ")"
            else if(lastChar === ")"){
                //decrement the count of closing brackets by 1
                bracketCloseCount--;
            }
        }

        //delete the last character from the display
        screen.textContent = screen.textContent.slice(0, screen.textContent.length-1); 

        //store the new last character after deletion in a variable
        let newLastChar = screen.textContent[screen.textContent.length-1];

        //check for the new last character for an operator
        for(let operatorSymbol of operatorSymbols){
            //if the new last character is an operator or a decimal point
            if(newLastChar === operatorSymbol || newLastChar === "."){
                //next character should not be an operator; "-" sign cannot be added
                isOperatorPressed = true;
                isSignPressed = true;
            }
        }
        //check for the new last character for "%" sign
        if(newLastChar === "%"){
            //next character should not be "%"
            isPercentPressed = true;
        }
        //check the new last character for a "("
        else if(newLastChar === "("){
            //if it is a "(", check if it has a negative sign
            if(signIndex.includes(screen.textContent.length-2) || signBracketIndex.includes(screen.textContent.length-3)){
                //prevent addition of another "-" sign if sign button is pressed
                isSignPressed = true;
            }
            //if there is no negative sign
            else{
                //"-" sign can be added
                isSignPressed = false;
            }
            //decimal point can be added 
            isDecimalPressed = false;
        }
        //check new last character for ")" 
        else if(newLastChar === ")"){
            //loop through the string to check for corresponding opening bracket
            for(let i=screen.textContent.length-1; i>=0; i--){
                //check if a ")" comes before "(", moving backwards from the last character
                if(screen.textContent[i] === ")"){
                    //if ")" comes before "(", increment the value of 'closeCount', that keeps the count of closing brackets
                    closeCount++;
                }
                //check if a "(" comes before ")"
                else if(screen.textContent[i] === "("){
                    //if a "(" comes before ")", increment the value of 'openCount' that keeps the count of opening brackets
                    openCount++;
                    //check if the number of opening and closing bracket is equal
                    if(openCount === closeCount){
                        //if opening and closing brackets are equal, check if the current "(" is preceded by a "-" sign i.e the bracket expression is a negative value
                        if(signIndex.includes(i-1) || signBracketIndex.includes(i-2)){
                            //if the bracket expression has a negative value, change 'isSignPressed' to 'true' to make sure that a "-" sign cannot be further added
                            isSignPressed = true;
                            //break out of the loop
                            break;
                        }
                        //if the bracket expression is a positive value
                        else{
                            //change 'isSignPressed' to 'false' to make sure that a "-" sign can be added now to make it a negative value
                            isSignPressed = false;
                            //break out of loop
                            break;
                        }
                    }
                }        
            } 
        }
        //if new last character does not match any of the above conditions
        else{
            //loop through the string to check for a "-" sign 
            for(let i=screen.textContent.length-1; i>=0; i--){
            
                //check if the current character is an operator other than "-", "(", ")" and if it's a "(", should not be a part of "-" sign
                if((screen.textContent[i] === "+" || screen.textContent[i] === "*" || screen.textContent[i] === "/")){
                    //if the above condition is true, change 'isSignPressed' to 'false' and break out of the loop
                    isSignPressed = false;
                    break;
                } 
                //check if the current character is a "%" sign
                else if(screen.textContent[i] === "%"){
                    //if the above condition is true, change 'isSignPressed' to 'true' and break out of the loop
                    isSignPressed = true;
                    break;
                }
                //check if the current character is a "-" sign and it is negative sign and not an operator
                else if(screen.textContent[i] === "-" && (signIndex.includes(i) || signBracketIndex.includes(i-1))){
                    //if the current character is a negative sign, change 'isSignPressed' to 'true' and break out of the loop
                    isSignPressed = true;
                    break;
                } 
                //if the current character is not an operator or bracket or a negative sign 
                else{
                    //if the current character is a number or a decimal, change 'isSignPressed' to 'false' and continue the loop
                    isSignPressed = false;
                    continue;
                }      
            } 
        }       
    }
}  

//function to add opening bracket "("
function addOpeningBracket(lastChar){

    //check if the last character is not a "."; the "(" should not be added if the last character is a "."
    if(lastChar !== "."){
        //check if 'equal' button is pressed
        if(isEqualPressed){
            //if 'equal' button is pressed, extract the result from the display string and remove everything before that
            screen.textContent = screen.textContent.slice(screen.textContent.indexOf("=")+2);
            //set 'isEqualPressed' to 'false'
            isEqualPressed = false;
        }
        //check if there is no operator before the "(", or there is already a "("
        if(!isOperatorPressed || lastChar === "("){
            //if the last character is a "(" or it is not an operator, add a "*" sign before adding the "("
            screen.textContent = screen.textContent.concat("*");
            //set 'isSignPressed' to 'false' so that a negative sign can be added
            isSignPressed = false;
        }
 
        //check if the "(" would be the first character on the display
        if(!screen.textContent.length){
            //set 'isSignPressed' to 'false' so that a negative sign can be added
            isSignPressed = false;
        }

        //add the "(" symbol to the display
        screen.textContent = screen.textContent.concat("(");
        //increment the number of opening brackets by 1
        bracketOpenCount++;
        //set 'isDecimalPressed' to 'false' so that a "." could now be added
        isDecimalPressed = false;
        //set 'isSignPressed' to 'false' so that a "-" sign could now be added
        isSignPressed = false;
        //set 'isOperatorPressed' to 'false'
        isOperatorPressed = false;
        //set 'isPercentPressed' to 'false' to ensure that a number could be added
        isPercentPressed = false;
    }
}

//function to add closing bracket ")"
function addClosingBracket(lastChar){
    //initialize variables to keep count of opening and closing brackets
    let openCount = 0;
    let closeCount = 0;

    //check if the display is not blank; 'equal' is not pressed; last character is not an operator, or a "(" or a ".";
    //and the number of ")" does not exceed the number of "("
    if(screen.textContent.length && !isEqualPressed && !isOperatorPressed && lastChar !== "(" && lastChar !== "." && bracketOpenCount > bracketCloseCount){
        //add ")" to the display
        screen.textContent = screen.textContent.concat(")");
        //increment the number of closing brackets by 1
        bracketCloseCount++;
        //ensure that a "%" sign can now be added
        isPercentPressed = false;
        //check if the number of opening brackets is equal to the number of closing brackets
        if(bracketOpenCount === bracketCloseCount){
            //if "(" and ")" have equal number, ensure that "-" sign could be added to the whole expression inside the brackets  
            isSignPressed = false;
        }
      
        //loop through the expression string to check for the corresponding opening bracket for the current closing bracket
        for(let i=screen.textContent.length-1; i>=0; i--){
            //check if a ")" comes before "(", moving backwards from the last character
            if(screen.textContent[i] === ")"){
                //if ")" comes before "(", increment the value of 'closeCount', that keeps the count of closing brackets
                closeCount++;
            }
            //check if a "(" comes before ")"
            else if(screen.textContent[i] === "("){
                //if a "(" comes before ")", increment the value of 'openCount' that keeps the count of opening brackets
                openCount++;
                //check if the number of opening and closing bracket is equal
                if(openCount === closeCount){
                    //if opening and closing brackets are equal, check if the current "(" is preceded by a "-" sign i.e the bracket expression is a negative value
                    if(signIndex.includes(i-1) || signBracketIndex.includes(i-2)){
                        //if the bracket expression has a negative value, change 'isSignPressed' to 'true' to make sure that a "-" sign cannot be further added
                        isSignPressed = true;
                        //break out of the loop
                        break;
                    }
                    //if the bracket expression is a positive value
                    else{
                        //change 'isSignPressed' to 'false' to make sure that a "-" sign can be added now to make it a negative value
                        isSignPressed = false;
                        //break out of loop
                        break;
                    }
                }
            }        
        }   
    }
}     

//function to add negative sign "-"
function signPress(lastChar){

    //initialize variables to store index of operator and bracket
    let foundOperator = 0;
    let foundBracket = 0;
    let openCount = 0;
    let closeCount = 0;
    //variables to store the status of operator search and bracket search
    let isOperator = false;
    let isBracket = false;

    //check if the string ends with an opening bracket
    if(lastChar === "("){

        //store the index of character before the bracket in 'foundOperator'
        foundOperator = screen.textContent.length-2;

        //update the status of operator search variable to true 
        isOperator = true;

    }
    //check if the string ends with a closing bracket
    else if(lastChar === ")"){

        //search the index of opening bracket
        for(let i=screen.textContent.length-1; i>=0; i--){

            // if opening bracket is found
            if(screen.textContent[i] === "("){

                //increment 'openCount' by 1
                openCount++;
                //check if the number of opening brackets is equal to the number of closing brackets
                if(openCount === closeCount){
                    //check if the opening bracket is not the first character
                    if(i){
                        //store the index before the opening bracket in 'foundOperator'  
                        foundOperator = i-1;
                        //update the status of operator search variable to true and break out of the loop
                        isOperator = true;
                        break;
                    }
                    //if the opening bracket is the first character
                    else{
                        //update the status of operator search variable to false and break out of the loop
                        isOperator = false;
                        break;
                    }
                } 
            } 
            //if closing bracket is found   
            else if(screen.textContent[i] === ")"){
                //increment 'closeCount' with 1 
                closeCount++;
            }               
        }
    }
    
    else{

        //if the string does not end with an opening or a closing bracket  
        Loop1: for(let i = screen.textContent.length-1; i >= 0; i--){
          
            //search for the index of ")"
            if(screen.textContent[i] === ")"){
                //store the index of ")" in 'foundOperator' variable
                foundOperator = i;
                //change 'isOperator' to 'true' and break out of the loop
                isOperator = true;
                break;
            }        
            //search for the index where opening bracket appears      
            else if(screen.textContent[i] === "("){

                //store the index of bracket in 'foundBracket'
                foundBracket = i;

                //update the status of bracket search variable to true and break out of the loop
                isBracket = true;
                break;
            }
            else{
                //if an operator is found before a bracket
                for(let operatorSymbol of operatorSymbols){

                    //search for the index where operator appears
                    if(screen.textContent[i] === operatorSymbol){
                
                        //store the index of operator in 'foundOperator'
                        foundOperator = i;

                        //update the status of operator search variable to true and break out of the loop
                        isOperator = true;
                        break Loop1;
                    }
                }
            }
        }
    }
    
    //if operator is found before bracket
    if(isOperator){
        //add a "(" and "-" sign after the operator
        screen.textContent = screen.textContent.slice(0, foundOperator+1) + "(-" + screen.textContent.slice(foundOperator+1);
        //increment the number of opening bracket by 1
        bracketOpenCount++;
        //push the index value of the added "(" to 'signBracketIndex' array
        signBracketIndex.push(foundOperator+1);
    }
    //if bracket is found before operator
    else if(isBracket){
        //add a "-" sign after the bracket
        screen.textContent = screen.textContent.slice(0, foundBracket+1) + "-" + screen.textContent.slice(foundBracket+1);
        //push the index value of the added "-" to 'signIndex' array
        signIndex.push(foundBracket+1);
    } 
    //if neither bracket is found nor operator i.e the number is at the start of the expression   
    else {
        //add a "-" sign to the start of the expression string
        screen.textContent = "-" + screen.textContent;
        //push the index value of the added "-" to 'signIndex' array
        signIndex.push(0);
    }
    //return true value
    return true;
}


//function to remove already existing negative sign
function signRemove(lastChar){

    //initialize variables to keep the count of opening and closing brackets
    let openCount =0;
    let closeCount =0;
    //initialize variable to store the index of "-" sign
    let foundSign =0;
    //initialize variable to check if bracket is present
    let isBracket = false;

    //check if the last character is a "("
    if(lastChar === "("){
        //if the last character is a "(", it's preceding character should be "-"; update the value of 'foundSign' to this index
        foundSign = screen.textContent.length-2;
        //change 'isBracket' to 'true'
        isBracket = true;
    }
    
    //else check if the last character is a ")"
    else if(lastChar === ")"){
        //loop through the string to get the corresponding "(" for the ")"
        for(let i=screen.textContent.length-1; i>=0; i--){
            //check if a ")" is found 
            if(screen.textContent[i] === ")"){
                //if a ")" if found, increment the value of 'closeCount' 
                closeCount++;
            }
            //check if a "(" is found
            else if(screen.textContent[i] === "("){
                //if a "(" is found, increment the value of 'openCount'
                openCount++;
                //check if the number of opening and closing brackets are equal
                if(openCount === closeCount){
                    //if 'openCount' and 'closeCount' are equal i.e the corresponding "(" for the ")" is found,
                    //update the value of 'foundSign' to the preceding index
                    foundSign = i-1;
                    //change 'isBracket' to 'true' and break out of the loop
                    isBracket = true;
                    break;             
                } 
            }
        }
    }

    //check if the last character is a "(" or a ")"
    if(isBracket){
        //if true, check if the "-" sign precedes a "(" added with it 
        if(signBracketIndex.includes(foundSign-1)){
            //if true, remove the "-" and the preceding "(" both from the string
            screen.textContent = screen.textContent.slice(0, foundSign-1) + screen.textContent.slice(foundSign+1);
            //decrement the number of opening brackets in the string by 1
            bracketOpenCount--;
        }
        //else check if the "-" sign is present alone
        else if(signIndex.includes(foundSign)){
            //if true, remove the "-" sign form the string
            screen.textContent = screen.textContent.slice(0, foundSign) + screen.textContent.slice(foundSign+1);
        }
    }
    //if the last character is not a "(" or a ")"
    else{
        //check for "-" sign or "("
        for(let i = screen.textContent.length-1; i >= 0; i--){

            //check if the character is "-" and if a bracket was added before it when the sign button was pressed
            if(screen.textContent[i] === "-" && signBracketIndex.includes(i-1)){

                //remove the "(" and the "-" sign from the string
                screen.textContent = screen.textContent.slice(0, i-1) + screen.textContent.slice(i+1);

                //remove the index of "(" from the 'signBracketIndex' array
                signBracketIndex.splice(signBracketIndex.indexOf(i-1), 1);  
        
                //decrement the number of opening brackets by 1 and break out of the loop        
                bracketOpenCount--;
                break;
            }
            //check if the character is "-" and if only the negative sign was added in the string when sign button was pressed
            else if(screen.textContent[i] === "-" && signIndex.includes(i)){
                //remove the "-" sign from the string
                screen.textContent = screen.textContent.slice(0, i) + screen.textContent.slice(i+1);
                //remove the index of "-" sign from 'signIndex' array and break out of the loop
                signIndex.splice(signIndex.indexOf(i), 1);
                break;
            }
        }
    }
    //return false value
    return false;
}

//function to extract the expression string when "=" sign is pressed
function equalPress(){

    //copy the content of display into a temporary string variable
    let expressionStr = screen.textContent;
    //declare arrays to store the indices of opening brackets and closing brackets separately
    let bracketOpenIndex = [];
    let bracketCloseIndex = [];
    //initialize temporary variables to store the indices of innermost opening and closing brackets
    let innerBracketOpen = 0;
    let innerBracketClose = 0;
    //initialize local variable to store the result of the operations
    let result = 0.0;

    //add "=" sign to the display
    screen.textContent = screen.textContent.concat(" = ");

    //check for all closing brackets followed by a number or a decimal point   
    for(let i = 0; i < expressionStr.length; i++){
        //check for the index of closing brackets
        if(expressionStr[i] === ")"){
            //if a closing bracket is found, check if it is not followed by an operator or another closing bracket or is the last character
            if(expressionStr[i+1]!=="+" && expressionStr[i+1]!=="-" && expressionStr[i+1]!=="*" && expressionStr[i+1]!=="/" && expressionStr[i+1]!=="%"
               && expressionStr[i+1]!==undefined && expressionStr[i+1]!==")"){
                //if the closing bracket is followed by a number or a decimal point, add a "*" sign after it
                expressionStr=expressionStr.slice(0, i+1) + "*" + expressionStr.slice(i+1);
                //increment the value of i since the expression string has an extra character added
                i++;
            }
        }
    }
 
    //code block to first calculate the expression inside brackets
    //continue checking for brackets until all bracket expressions are calculated 
    while(expressionStr.includes("(") && expressionStr.includes(")")){
        
        //check for the indices of opening and closing brackets
        for(let i = 0; i < expressionStr.length; i++){
            //check if the character is a "("
            if(expressionStr[i] === "("){
                //add the index of "(" to the 'bracketOpenIndex' array
                bracketOpenIndex.push(i);
            }
            //if the character is not a "(", check if it is a ")"
            else if(expressionStr[i] === ")"){
                //add the index of ")" to the 'bracketCloseIndex' array
                bracketCloseIndex.push(i);
            }
            //if the character is neither a "(" nor a ")", continue the loop for next character
            else{
              continue;
            }  
        }
  
        //initialize the 'innerBracketOpen' and 'innerBracketClose' variables with the first values in 'bracketOpenIndex' and 'bracketCloseIndex' arrays
        innerBracketOpen = bracketOpenIndex[0];
        innerBracketClose = bracketCloseIndex[0];

        //loop through 'bracketOpenIndex' array and check for the highest index in which opening bracket occurs        
        for(let i = 0; i < bracketOpenIndex.length; i++){
            //check if the current index value is greater than the first index value
            if(bracketOpenIndex[i] > innerBracketOpen){
                //if the current index value is greater than the first value, store this value to the 'innerBracketOpen' variable
                innerBracketOpen = bracketOpenIndex[i];   
            }
        }
        //remove the innermost bracket index value from the 'bracketOpenIndex' array
        bracketOpenIndex.splice(bracketOpenIndex.indexOf(innerBracketOpen), 1);

        //code block to get the innermost opening and closing bracket pair
        //loop through the expression string, starting from the innermost opening bracket, until a closing bracket is found
        for(let i = innerBracketOpen; i < expressionStr.length; i++){
            //check if the current character is a closing bracket
            if(expressionStr[i] === ")"){
                //if a ")" is found, store its index in 'innerBracketClose' variable
                innerBracketClose = i;
                //remove this index value from the 'bracketCloseIndex' array and break out of the loop
                bracketCloseIndex.splice(bracketCloseIndex.indexOf(i), 1);
                break;
            }
        }

        //extract the expression between the innermost opening and innermost closing bracket into a temporary variable
        let bracketExpression = expressionStr.slice(innerBracketOpen+1, innerBracketClose);
         
        //call 'processString()' function with the bracket expression and store the calculated result in a temporary variable 
        let bracketResult = processString(bracketExpression);
          
        //add the result of the bracket expression to the appropriate place in the expression string and remove the brackets
        expressionStr = expressionStr.slice(0, innerBracketOpen) + `${bracketResult}` + expressionStr.slice(innerBracketClose+1);
          
        //if there is a "*" sign followed by a number and without a left operand, remove this "*"   
        for(let i=0; i<expressionStr.length; i++){

            //check if there is a "(" followed by a "*" followed by a number
            if(expressionStr[i] === "(" && expressionStr[i+1] === "*" && expressionStr[i+2] !== "("){

                //remove the "*" sign without a left operand
                expressionStr = expressionStr.slice(0, i+1) + expressionStr.slice(i+2);
            }
        }
        //reset the values of arrays and temporary variables to the initial values for the next iteration of the loop
        bracketOpenIndex = [];
        bracketCloseIndex = [];
        bracketExpression = "";
        bracketResult = 0.0;  
    } 

    //call the 'processString()' function with the expression string as an argument to calculate the result; store this result in a local variable  
    result = processString(expressionStr);  
    //display the result to the calculator screen
    screen.textContent= screen.textContent.concat(result);
    //return true value
    return true;   
}

//function to process the expression string for calculation; takes the expression string as argument
function processString(string){
  
    //initialize variable 'foundOperator' for percentage calculation to 'false'
    let foundOperator = false;
    //initialize temporary variables for operands for percentage calculation 
    let firstOperand = 0;
    let secondOperand = 0;
    //initialize temporary variable to store the result of percentage calculation
    let result = 0;
    //initialize 'newExpressionStr' variable with an empty string
    let newExpressionStr = "";
    //initialize 'finalResult' variable 
    let finalResult = 0;

    //loop to check for "%" operators
    loop1: while(1){
        //check if the expression string includes any "%" operators
        if(string.includes("%")){
            //if the expression string has "%" operators, store the index of that operator in a temporary variable
            let percentIndex = string.indexOf("%");
            
            //loop to check for operators that come before the "%" operator
            loop2: for(let i=percentIndex; i>=0; i--){
                //loop through the 'operatorSymbol' array to match the current character with the operators
                for(let operatorSymbol of operatorSymbols){ 
                    //check if the current character matches an operator  
                    if(string[i] === operatorSymbol){
                        //if a match is found, check if it's a "*" or "/" operator; if not, check if "%" is immediately followed by a "*" or "/" 
                        if(string[i] === "*" || string[i] === "/" || string[percentIndex+1] === "*" || string[percentIndex+1] === "/"){
                            //if the above conditions are true, change 'foundOperator' to 'true';
                            foundOperator = true;
                            //store the operand before "%" in 'firstOperand' variable
                            firstOperand = parseFloat(string.slice(i+1, percentIndex));
                            //divide this operand by 100 and store the result in 'result' variable
                            result = firstOperand / 100;
                            //update the expression string with the result value replacing the "%" and its operand
                            string = string.slice(0, i+1) + result + string.slice(percentIndex+1);
                            //break out of loop2               
                            break loop2;
                        }
                        //if the above condition is false, check if the left operator is a "+" or a "-" and the following operator is not a "*" or "/"
                        else if((string[i] === "+" || string[i] === "-") && string[percentIndex+1] !== "*" && string[percentIndex+1] !== "/"){
                            //if the above conditions are true, change 'foundOperator' to 'true'  
                            foundOperator = true;
                            //store the substring before the "+" or "-" operator in 'newExpressionStr' variable
                            newExpressionStr = string.slice(0, i);
                            //evaluate the value of the substring expression by calling 'processString()' function
                            newExpressionStr = processString(newExpressionStr);
                            //store the evaluated result of the substring expression in 'firstOperand' variable
                            firstOperand = parseFloat(newExpressionStr);
                            //store the operand before "%" operator in 'secondOperand' variable
                            secondOperand = parseFloat(string.slice(i+1, percentIndex));
                            //check if the left operator is a "+"
                            if(string[i] === "+"){
                                //if it's a "+", calculate the percentage of the 'firstOperand' and add the result to itself 
                                result = firstOperand + firstOperand * secondOperand / 100;
                            }
                            //if the left operator is not a "+"
                            else{
                                //if it's a "-", calculate the percentage of the 'firstOperand' and subtract the result from itself
                                result = firstOperand - firstOperand * secondOperand / 100;
                            }
                            //update the expression string with the result value replacing the "%" and its operands
                            string = result + string.slice(percentIndex+1);
                            //break out of loop2
                            break loop2;
                        }        
                    }
                }                             
            }
            //if there is no operator before "%"
            if(!foundOperator){
                //store the operand before "%" in 'firstOperand' variable
                firstOperand = parseFloat(string.slice(0, percentIndex));
                //divide the 'firstOperand' by 100 and store the result in 'result' variable
                result = firstOperand / 100;
                //update the expression string by replacing the operand value with the result
                string = result + string.slice(percentIndex+1); 
            }          
        }
        //if the expression string does not include any "%" sign, break out of the while loop
        else{
            break loop1;
        }
    }
   
    //loop to check for "+", "-", "*", and "/" operators
    loop3: while(1){
       
        //check if the expression string includes "+", "-", "*", or "/"        
        if(string.includes("+") || string.includes("-") || string.includes("*") || string.includes("/")){            
            //if the above condition is true, initialize 'isOperator' variable to false 
            let isOperator = false;
            //check if the first character of the expression string is a "-" sign
            if(string[0] === "-"){
                //if there is a "-" sign at the beginning, loop through the string to check for other operators
                for(j=1; j<string.length; j++){
                    //loop through the 'operatorSymbols' array to find a match
                    for(let operatorSymbol of operatorSymbols){
                        //check if the current character matches an operator
                        if(string[j] === operatorSymbol){
                            //if an operator is found in the string, make 'isOperator' true and break out of the inner loop
                            isOperator = true;
                            break;
                        }
                    }
                }
                //if there is no operator in the string, break out of the while loop
                if(!isOperator){
                    break loop3;
                }
            }
             
            //initialize arrays to store operands ans operators
            let operandList = [];
            let operatorList =[];

            //initialize variable to store operand characters temporarily
            let operandStr = "";

            //loop through the expression string to separate operands and operators
            for(let i=0; i<string.length; i++){
                
                //check if the current character is a "-" sign and the next character is also a "-" sign
                // and the current character is the first character in the string
                if(string[i] === "-" && string[i+1] === "-" && string[i-1] === undefined){
                    //if the above condition is true, add "0" as an operand to the 'operandList' array
                    operandList.push(0);
                    //push the current "-" sign to the 'operatorList' array
                    operatorList.push(string[i]);
                }
                
                //if the above condition is false, check if current character is "-" and the previous character is a "+", "-", "*", or "/" 
                // or the current character is the first character in the string
                else if(string[i] === "-" && (string[i-1] ===  "+" || string[i-1] ===  "-" || string[i-1] ===  "*" || string[i-1] ===  "/" 
                        || string[i-1] === undefined)){
                   
                    //if the above condition is true, add the current character to the 'operandStr' variable        
                    operandStr = operandStr.concat(string[i]);         
                }
                  
                //if the above condition is false, check if the current character is an operator
                else if(string[i] ===  "+" || string[i] ===  "-" || string[i] ===  "*" || string[i] ===  "/"){
                    
                    //if the current character is an operator, push the value of 'operandStr' to the 'operandList' array
                    operandList.push(parseFloat(operandStr));
                    //reset the 'operandStr' variable to empty string
                    operandStr = "";
                    //push the current operator to the 'operatorList' array
                    operatorList.push(string[i]);                            
                }
        
                //if the above condition is false, check if the current character is a decimal point
                else if(string[i] === "."){
                    
                    //if the current character is a ".", add this to the 'operandStr' variable
                    operandStr = operandStr.concat(string[i]);
                }

                //if all of the above conditions are false
                else{
          
                    //loop through the 'numberSymbols' array to check for numbers
                    for(let numberSymbol of numberSymbols){
                        
                        //check if the current character matches a number
                        if(string[i] === numberSymbol){
                           
                            //if a match is found, add this number to 'operandStr' array
                            operandStr = operandStr.concat(string[i]);                          
                        }
                    }
                }         
            }
            
            //push the last operand to the 'operandList' array
            operandList.push(parseFloat(operandStr));
            //reset the 'operandStr' variable to empty string
            operandStr = ""; 
            //send the 'operandList' and 'operatorList' arrays as arguments to 'calculateResult()' function to calculate the result
            result = calculateResult(operandList, operatorList); 
            //replace the expression string with the result 
            string = `${result}`;                    
        }
        //if the string does not contain any operator, break out of the while loop
        else{
            break loop3;
        }
    }
 
    //convert the resulting string into float and store in 'finalResult' variable
    finalResult = parseFloat(string);
    //convert the 'finalResult' to 4 decimal places
    finalResult = parseFloat(finalResult.toFixed(4));
    //return the updated string
    return finalResult;
}

//function to calculate the result of expressions; takes operands array and operators array as arguments
function calculateResult(operands, operators){

    //put the code inside 'try' block to catch errors
    try{
    
        //copy the operators array elements into another array
        let updatedOperators = [...operators];
       
        //initialize result variable
        let result = 0.0;
    
        //convert all subtraction operators to addition operators in 'updatedOperators' array
        for(let i=0; i<updatedOperators.length; i++){
    
            //check if the current element is a "-" operator
            if(updatedOperators[i] === "-"){
    
                //if it is a "-" operator, convert it to "+" operator
                updatedOperators[i] = "+";
    
                //change the sign of the right-side operand
                operands[i+1] = 0 - operands[i+1];
            }
        }
        
        //calculation for division ("/")
        //outer loop for making sure all operators are visited at least once
        for(let i = 0; i < operators.length; i++){
            //inner loop that matches each element value with the given operator
            for(let j = 0; j < updatedOperators.length; j++){
                //check if the current element value is "/"
                if(updatedOperators[j] === "/"){
                    //check if both the operands are 0
                    if(operands[j] === 0 && operands[j+1] ===0){
                        //if both operands of division are 0, throw error  
                        throw new Error("Indeterminate Form!!!")
                    }
                    //check if denominator is 0
                    else if(operands[j+1] ===  0){
                        //if denominator is 0, throw error
                        throw new Error("Can't divide by 0!!!");
                    }
                    //if the current element value is "/", divide the left operand by the right operand
                    // and store the result in place of left operand
                    operands[j] = operands[j] / operands[j+1];
                    //remove the right operand from the 'operands' array
                    operands.splice(j+1, 1);
                    //remove the given "/" operator from the 'updatedOperators' array and break out of the inner loop
                    updatedOperators.splice(j, 1);
                    break;
                }
                //if the current element is not "/" continue the loop
                else{
                    continue;
                }    
            }
        }
        
        //calculation for multiplication ("*")
        //outer loop for making sure all operators are visited at least once
        for(let i = 0; i < operators.length; i++){
            //inner loop that matches each element value with the given operator
            for(let j = 0; j < operators.length; j++){
                //check if the current element value is "*"
                if(updatedOperators[j] === "*"){
                    //if the current element value is "*", multiply the left operand by the right operand
                    // and store the result in place of left operand
                    operands[j] = operands[j] * operands[j+1];
                    //remove the right operand from the 'operands' array
                    operands.splice(j+1, 1);
                    //remove the given "*" operator from the 'updatedOperators' array and break out of the inner loop
                    updatedOperators.splice(j, 1);
                    break;
                }
                //if the current element is not a "*", continue the loop
                else{
                    continue;
                }
            }
        }
        
        //calculation for addition ("+")
        //outer loop for making sure all operators are visited at least once
        for(let i = 0; i < operators.length; i++){
            //inner loop that matches each element value with the given operator
            for(let j = 0; j < operators.length; j++){
                //check if the current element value is "+"
                if(updatedOperators[j] === "+"){
                    //if the current element value is "+", add the left operand to the right operand
                    // and store the result in place of left operand
                    operands[j] = operands[j] + operands[j+1];
                    //remove the right operand from the 'operands' array
                    operands.splice(j+1, 1);
                    //remove the given "+" operator from the 'updatedOperators' array and break out of the inner loop
                    updatedOperators.splice(j, 1);
                    break;
                }
                //if the current element is not a "+", continue the loop
                else{
                    continue;
                }  
            }
        }
        
        //convert the result to 4 decimal places and store the value in 'result' variable
        result = parseFloat(operands[0].toFixed(4));
       
        //return the result
        return result;  
    }
    //function to catch errors generated inside 'try' block
    catch(e){
        //display error message on the screen      
        screen.value = e.message + " Press C to enter new expression";
        //change 'isError' to 'true'
        isError = true;    
    }  
}


//code block to detect calculator button click
for(let btn of btns){
   
    //listener function for button click
    btn.addEventListener("click", function(){
        
        //temporarily store the last character of display string in a variable
        let lastChar = screen.textContent[screen.textContent.length-1];
     
        //check if the clicked button is "C"
        if(btn.value === "C"){
            //check if the previous calculation threw an error
            if(isError === true){
                //reload the page to remove the previous error message
                location.reload();
                //turn 'isError' to 'false'
                isError = false;
            }
            //if the clicked button is "C", call function 'clearScreen()'
            clearScreen();    
        }

        //check if the clicked button is "CE"
        else if(btn.value === "CE"){
            //if the clicked button is "CE", call function 'clearEntry()'
            clearEntry(lastChar);
        } 

        //check if the clicked button is "(" or ")"
        else if(btn.value === "(" || btn.value === ")"){
            //check if the clicked button is "("
            if(btn.value === "("){
                addOpeningBracket(lastChar);
            }
            //if the clicked button is a ")"
            else{
                addClosingBracket(lastChar);     
            }
        }
         
        //check if the clicked button is "="
        else if(btn.value === "="){
            //ensure that "=" sign can only be added if the display is not blank, "=" button is not already pressed, last character is not a "." or an operator,
            //and all opened brackets are closed
            if(screen.textContent.length && !isEqualPressed && lastChar !== "." && !isOperatorPressed && bracketOpenCount === bracketCloseCount){
                //reset the values of variables that store the number of opening and closing brackets to their initial values
                bracketOpenCount = 0;
                bracketCloseCount = 0;
                //ensure that a decimal point can be added now
                isDecimalPressed = false;
                //ensure that an operator can be added now
                isOperatorPressed = false;
                //ensure that "-" sign should not be added to the result
                isSignPressed = true;
                //ensure that a number can be added now
                isPercentPressed = false;
                
                //call 'equalPress()' function to evaluate the result of the entered expression
                isEqualPressed = equalPress(); 
            }          
        } 
            
        //check if the clicked button is a sign "+/-" button
        else if(btn.value === "+/-"){
            //ensure that "-" sign can only be added if the display is not blank, 'equal' is not pressed, and last character is not an operator
            if(screen.textContent.length && !isEqualPressed && !isOperatorPressed && !isPercentPressed){
                //check if there is already a "-" sign in the current operand 
                if(!isSignPressed){
                    //if the current operand is not signed, call 'signPress()' function to add "-" sign to it
                    isSignPressed = signPress(lastChar);   
                }
                //if the current operand already has a "-" sign
                else{
                    //call 'signRemove()' function to remove the "-" sign
                    isSignPressed = signRemove(lastChar);  
                }
            }
        }
        
        //check if the clicked button is a decimal point "."
        else if(btn.value === "."){
            //ensure that decimal point should not appear more than once in a number
            if(!isDecimalPressed){
                //check if 'equal' is pressed
                if(isEqualPressed){
                    //if 'equal' is pressed, clear the last expression from the screen
                    screen.textContent = "";
                    //set 'isEqualPressed' to 'false' to make sure "=" sign can now be added 
                    isEqualPressed = false;
                }
                //add "." symbol to the display 
                screen.textContent = screen.textContent.concat(".");
                //ensure that "." cannot be further added to the same number
                isDecimalPressed = true;               
            }
        }    
        
        //check if the clicked button is a "%" sign
        else if(btn.value === "%"){
            //ensure that "%" can only be added if the display is not blank, last character is not an operator, a "%" sign, a ".", or a "("
            if(screen.textContent.length && !isOperatorPressed && !isPercentPressed && lastChar !== "." && lastChar !== "("){
                //ensure that after this value is added, another "%" sign cannot be added
                isPercentPressed = true;
                //ensure that a "." cannot be added after this 
                isDecimalPressed = true;
                //ensure that "-" sign cannot be added to this
                isSignPressed = true;
                
                //check if 'equal' is pressed
                if(isEqualPressed){
                    //if 'equal' is pressed, clear the last expression from the display and only the result of the previous calculation remains
                    screen.textContent = screen.textContent.slice(screen.textContent.indexOf("=") + 2);
                    //ensure that 'equal' can be pressed after this value is added
                    isEqualPressed = false;
                }
                //add the "%" symbol to the display
                screen.textContent = screen.textContent.concat(btn.value);
            }
        } 
        
        //check for all other button presses not covered till now   
        else{
            //check for operator buttons
            for(let operatorBtn of operatorBtns){
                //check if the clicked button is an operator
                if(btn.value === operatorBtn.value){
                    //ensure that the screen is not blank, last character is not an operator or a "." or a "("
                    if(screen.textContent.length && !isOperatorPressed && lastChar !== "." && lastChar !== "("){
                        //ensure that decimal point can now be added after this value
                        isDecimalPressed = false;
                        //ensure that "-" cannot be added after this value
                        isSignPressed = true;
                        //ensure that another operator cannot be added afte this
                        isOperatorPressed = true;
                        //ensure that a "%" sign can be added after this
                        isPercentPressed = false;
                        
                        //check if 'equal' is pressed
                        if(isEqualPressed){
                            //if 'equal' is pressed, clear the display of its last expression and only the result remains
                            screen.textContent = screen.textContent.slice(screen.textContent.indexOf("=") + 2);
                            //ensure that 'equal' can now be pressed
                            isEqualPressed = false;
                        }
                        //add the operator symbol to the display
                        screen.textContent = screen.textContent.concat(btn.value);
                    }
                }
            }    
            
            //check for number buttons
            for(let numBtn of numBtns){
                //check if the clicked button is a number
                if(btn.value === numBtn.value){
                    //ensure that a number cannot be added after a "%" symbol
                    if(!isPercentPressed){
                        //check if 'equal' is pressed 
                        if(isEqualPressed){
                            //if 'equal' is pressed, clear the display of all its contents
                            screen.textContent = "";
                            //add the number value to the display
                            screen.textContent = screen.textContent.concat(btn.value); 
                            //ensure that a "." can now be added
                            isDecimalPressed = false;
                            //ensure that 'equal' can now be pressed
                            isEqualPressed = false;
                            //ensure that "-" sign can now be added to the number
                            isSignPressed = false;
                        }
                        //if 'equal' is not pressed
                        else{
                            //check if the display is blank, or last character is an operator or a "("
                            if(!screen.textContent.length || (isOperatorPressed && !signIndex.includes(screen.textContent.length-1)
                               && !signBracketIndex.includes(screen.textContent.length-2)) || lastChar === "("){
                                //ensure that "-" sign can now be added to the number
                                isSignPressed = false;
                            }
                            //add the number value to the display
                            screen.textContent = screen.textContent.concat(btn.value); 
                        }
                        //ensure that an operator can now be added                     
                        isOperatorPressed = false;
                    }
                }
            }
        }
    })
}

//code block to detect key press

//listener funtion for key press
addEventListener("keydown", function(event){

    //temporarily store the last character of display string in a variable
    let lastChar = screen.textContent[screen.textContent.length-1];

    //check if the pressed key is "Escape"
    if(event.key === "Escape"){
        //if the pressed key is "Escape", call function 'clearScreen()'
        clearScreen(); 
    }

    //check if the pressed key is "Backspace"
    else if(event.key === "Backspace"){

        //if the pressed key is "Backspace", call function 'clearEntry()'
        clearEntry(lastChar);
    }

    //check if the pressed key is "(" or ")"
    else if(event.key === "(" || event.key === ")"){

        //if the pressed key is "("
        if(event.key === "("){

            //call function 'addOpeningBracket'
            addOpeningBracket(lastChar);     
        }
        //if the pressed key is ")"
        else{

            //call function 'addClosingBracket'
            addClosingBracket(lastChar);   
        }        
    }

    //check if the pressed key is "="
    else if(event.key === "="){

        //ensure that "=" sign can only be added if the display is not blank, "=" button is not already pressed, last character is not a "." or an operator,
        //and all opened brackets are closed
        if(screen.textContent.length && !isEqualPressed && lastChar !== "." && !isOperatorPressed && bracketOpenCount === bracketCloseCount){

            //reset the values of variables that store the number of opening and closing brackets to their initial values
            bracketOpenCount = 0;
            bracketCloseCount = 0;

            //ensure that a decimal point can be added now
            isDecimalPressed = false;

            //ensure that an operator can be added now
            isOperatorPressed = false;

            //ensure that "-" sign should not be added to the result
            isSignPressed = true;

            //ensure that a number can be added now
            isPercentPressed = false;

            //call 'equalPress()' function to evaluate the result of the entered expression
            isEqualPressed = equalPress(); 
        }             
    } 
        
    //check if the pressed key is "."
    else if(event.key === "."){

        //ensure that decimal point should not appear more than once in a number
        if(!isDecimalPressed){

            //check if 'equal' is pressed
            if(isEqualPressed){

                //if 'equal' is pressed, clear the last expression from the screen
                screen.textContent = "";

                //set 'isEqualPressed' to 'false' to make sure "=" sign can now be added 
                isEqualPressed = false;
            }

            //add "." symbol to the display 
            screen.textContent = screen.textContent.concat(".");

            //ensure that "." cannot be further added to the same number
            isDecimalPressed = true;               
        }
            
    }

    //check if the pressed key is a "%" sign
    else if(event.key === "%"){

        //ensure that "%" can only be added if the display is not blank, last character is not an operator, a "%" sign, a ".", or a "("
        if(screen.textContent.length && !isOperatorPressed && !isPercentPressed && lastChar !== "." && lastChar !== "("){

            //ensure that after this value is added, another "%" sign cannot be added
            isPercentPressed = true;

            //ensure that a "." cannot be added after this 
            isDecimalPressed = true;

            //ensure that "-" sign cannot be added to this
            isSignPressed = true;
                
            //check if 'equal' is pressed
            if(isEqualPressed){

                //if 'equal' is pressed, clear the last expression from the display and only the result of the previous calculation remains
                screen.textContent = screen.textContent.slice(screen.textContent.indexOf("=") + 2);

                //ensure that 'equal' can be pressed after this value is added
                isEqualPressed = false;
            }

            //add the "%" symbol to the display
            screen.textContent = screen.textContent.concat(event.key);
        }
    } 
        
    //check for all key presses not covered till now
    else{

        //check for operator symbol keys
        for(let operatorSymbol of operatorSymbols){
                
            //check if the pressed key is an operator symbol
            if(event.key === operatorSymbol){

                //ensure that the screen is not blank, last character is not an operator or a "." or a "("
                if(screen.textContent.length && !isOperatorPressed && lastChar !== "." && lastChar !== "("){

                    //ensure that decimal point can now be added after this value
                    isDecimalPressed = false;

                    //ensure that "-" cannot be added after this value
                    isSignPressed = true;

                    //ensure that another operator cannot be added afte this
                    isOperatorPressed = true;

                    //ensure that a "%" sign can be added after this
                    isPercentPressed = false;
                    
                    //check if 'equal' is pressed
                    if(isEqualPressed){

                        //if 'equal' is pressed, clear the display of its last expression and only the result remains
                        screen.textContent = screen.textContent.slice(screen.textContent.indexOf("=") + 2);

                        //ensure that 'equal' can now be pressed
                        isEqualPressed = false;
                    }
                    
                    //add the operator symbol to the display
                    screen.textContent = screen.textContent.concat(event.key);
                }
            }
        }
            
        //check for number keys
        for(let numberSymbol of numberSymbols){
                
            //check if the pressed key is a number
            if(event.key === numberSymbol){
                    
                //ensure that a number cannot be added after a "%" symbol
                if(!isPercentPressed){

                    //check if 'equal' is pressed 
                    if(isEqualPressed){

                        //if 'equal' is pressed, clear the display of all its contents
                        screen.textContent = "";

                        //add the number value to the display
                        screen.textContent = screen.textContent.concat(event.key); 

                        //ensure that a "." can now be added
                        isDecimalPressed = false;

                        //ensure that 'equal' can now be pressed
                        isEqualPressed = false;

                        //ensure that "-" sign can now be added to the number
                        isSignPressed = false;
                    }

                    //if 'equal' is not pressed
                    else{

                        //check if the display is blank, or last character is an operator or a "("
                        if(!screen.textContent.length || (isOperatorPressed && !signIndex.includes(screen.textContent.length-1) 
                            && !signBracketIndex.includes(screen.textContent.length-2)) || lastChar === "("){
                          
                            //ensure that "-" sign can now be added to the number
                            isSignPressed = false;
                        }

                        //add the number value to the display
                        screen.textContent = screen.textContent.concat(event.key); 
                    }
                        
                    //ensure that an operator can now be added                     
                    isOperatorPressed = false;
                }
            }
        }
    }
})










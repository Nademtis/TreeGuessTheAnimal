"use strict"

window.addEventListener("load", start)

function start() {
    registerButtonClicks()
    loadTreeFromJsonFile("tree.json")
}
let currentNode
let headNode
function loadTreeFromJsonFile(filename) {
    fetch(filename)
        .then(response => {
            return response.json();
        })
        .then(jsonTree => {
            currentNode = buildTreeFromJson(jsonTree);
            headNode = currentNode
            printQuestion(currentNode);
        })
}

function buildTreeFromJson(jsonTree) { //this function is built with gpt --not proud
    if (!jsonTree) return null;

    let node = {
        parent: null,
        question: jsonTree.question,
        yes: buildTreeFromJson(jsonTree.yes),
        no: buildTreeFromJson(jsonTree.no)
    };

    if (node.yes) node.yes.parent = node;
    if (node.no) node.no.parent = node;

    return node;
}
/*old hardcoded nodes
let striberJa = {
    parent: null,
    question: "Er det en zebra?",
    yes: null,
    no: null
}
let striberNej = {
    parent: null,
    question: "Er det en løve?",
    yes: null,
    no: null
}
let ørnLeaf = {
    parent: null,
    question: "Er det en ørn?",
    yes: null,
    no: null
}
let pingvinLeaf = {
    parent: null,
    question: "Er det en pingvin?",
    yes: null,
    no: null
}
let fuglYes = {
    parent: null,
    question: "Kan den flyve?",
    yes: ørnLeaf,
    no: pingvinLeaf
}
let øgleLeaf = {
    parent: null,
    question: "Er det en gila-øgle?",
    yes: null,
    no: null
}
let patteDyrNo = {
    parent: null,
    question: "Er det en fugl?",
    yes: fuglYes,
    no: øgleLeaf
}
let patteDyrJa = {
    parent: null,
    question: "Har det striber?",
    yes: striberJa,
    no: striberNej
}
let node1 = {
    parent: null,
    question: "Er det et pattedyr?",
    yes: patteDyrJa,
    no: patteDyrNo
}*/
function setParents() {
    patteDyrJa.parent = node1
    patteDyrNo.parent = node1

    øgleLeaf.parent = patteDyrNo
    fuglYes.parent = patteDyrNo
    pingvinLeaf.parent = fuglYes
    ørnLeaf.parent = fuglYes
    striberNej.parent = patteDyrJa
    striberJa.parent = patteDyrJa
}

function printQuestion(node) {
    const html = /*html*/ `<div class="question">
    <h2>${node.question}</h2>
    <div>
        <button id="yes">Yes</button>
        <button id="no">No</button>
      </div>
  </div>`

    document.querySelector("#container").insertAdjacentHTML("afterbegin", html)
}
function buttonClicked(button) {
    button.parentElement.remove()               //remove old buttons
    const isYes = button.id == "yes" ? true : false

    if (!currentNode.yes && !currentNode.no) {  //if leaf

        if (isYes) { //guess correct
            console.log("i guessed it"); //make alert window, that on submit calls resetGame()
            alert("I guessed it")
            resetGame();
        } else {
            makeFormsAndLearn()
        }

    } else {

        if (isYes) {
            currentNode = currentNode.yes
        } else {
            currentNode = currentNode.no
        }
        printQuestion(currentNode)
    }
}
function makeFormsAndLearn() {
    const html = /*html*/ `<div class="question">
    <h2>Damn... I give up</h2>
    <h4>Please tell me what is was, and what question I can ask next time</h2>
    <div>
    <form id="newQuestionForm">
      <input id="answer" type="text" placeholder="answer" required />
      <input id="question" type="text" placeholder="question" required />
      <button id="saveNewQuestion" type="submit">Save</button>
    </form>
      </div>
  </div>`

    document.querySelector("#container").insertAdjacentHTML("afterbegin", html)

    document.getElementById('newQuestionForm').addEventListener('submit', function (event) {
        event.preventDefault();
        saveNewQuestion();
    });
}
function saveNewQuestion() {
    let userAnswer = document.querySelector("#answer").value
    let userQuestion = document.querySelector("#question").value

    const newAnswerNode = {
        parent: null,
        question: `Is it a ${userAnswer} ?`,
        yes: null,
        no: null
    }

    const newQuestionNode = {
        parent: null,
        question: userQuestion,
        yes: newAnswerNode,
        no: currentNode
    }
    newAnswerNode.parent = newQuestionNode

    currentNode.parent.yes = newQuestionNode

    document.querySelector("#container").innerHTML = ""
    currentNode = headNode
    printQuestion(currentNode)

}
function registerButtonClicks() {
    document.querySelector("#container").addEventListener("click", userClicked)

    function userClicked(event) {
        const target = event.target
        if (target.tagName === "BUTTON" && target.id != "saveNewQuestion") {
            buttonClicked(target)
        }
    }
}
function dumpTree(node) {
    if (node) {
        console.log(node.question);
        dumpTree(node.yes);
        dumpTree(node.no);
    }
}
function resetGame() {
    document.querySelector("#container").innerHTML = ""
    currentNode = headNode
    printQuestion(currentNode)
}

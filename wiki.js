// const searchButton = document.getElementById('searchButton');
// var bar = document.getElementById("searchBar");
// searchButton.onclick = (event) =>{
//     event.preventDefault()
//     window.alert("button works");
//     bar.style.display = "none";
// }


// /*function hideBar() {
//     var bar = document.getElementById("searchBar");
//     if (checkLogin() == false) {
//         bar.style.display = "none";
//     }

// }*/


const allQuestions = [
  {
    question: "What type of government best describes the U.S.?",
    options: ["Direct Democracy", "Representative Democracy", "Dictatorship", "Oligarchy"],
    correctAnswer: "a"
  },
  {
    question: "What are the eligibility criteria for voting in the United States?",
    options: ["US citizenship and state-defined age", "US citizenship and age 21", "Permanent residency and age 18", "Citizenship and age 18"],
    correctAnswer: "d"
  },
  {
    question: "When is the next presidential election?",
    options: ["November 5, 2023", "March 15, 2024", "November 5, 2024", "March 17, 2024"],
    correctAnswer: "c"
  },
  {
    question: "Which of the following is not mentioned as a reason to vote?",
    options: ["Exercising a civic duty", "Influencing policy decisions", "Generating profit", "Engaging with the community"],
    correctAnswer: "c"
  },
  {
    question: "How often are Presidential elections in the US?",
    options: ["Every 2 years", "Every 4 years", "Every 6 years", "Every 8 years"],
    correctAnswer: "a"
  },
  {
    question: "Why are electoral votes used instead of direct votes?",
    options: ["There is no difference between the two other than wording.", "Electoral votes are a compromise between the federal government and state governments; this guarantees that states with significant populations cannot determine the outcome of the vote", "Direct votes may be counterfeit and not contribute to an accurate vote", "All of the above"],
    correctAnswer: "b"
  },
  {
    question: "How many electoral votes are required to win the election?",
    options: ["270", "271", "171", "170"],
    correctAnswer: "a"
  },
  {
    question: "What does voting provide in terms of community engagement and public discourse?",
    options: ["It hinders informed discussions", "It has no impact on community engagement", "It fosters awareness of current events and active participation in public discourse", "It encourages isolation from the community"],
    correctAnswer: "c"
  },
  // {
  //   question: "",
  //   options: ["", "", ""],
  //   correctAnswer: "a"
  // },
  // {
  //   question: "",
  //   options: ["", "", ""],
  //   correctAnswer: "a"
  // }
  // Add more questions in a similar format
];

// const originalEntries = Object.entries(allQuestions);

// Shuffle the array to randomize the order
shuffleArray(allQuestions);

// Create a new dictionary with the first 3 shuffled items
// const questions = Object.fromEntries(originalEntries.slice(0, 3));
const questions = allQuestions.slice(0, 6);
console.log(questions);

// Shuffle function to randomize the array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

let currentQuestion = 0;
let score = 0;

const questionContainer = document.getElementById("question-container");
const optionsContainer = document.getElementById("options-container");
const nextButton = document.getElementById("next-button");
const scoreSpan = document.getElementById("score");

nextButton.addEventListener("click", nextQuestion);

function nextQuestion() {
  const selectedAnswer = document.querySelector("input[name='answer']:checked");

  if (selectedAnswer && selectedAnswer.value === questions[currentQuestion].correctAnswer) {
      score++;
  }

  currentQuestion++;

  if (currentQuestion < questions.length) {
      showQuestion(currentQuestion);
  } else {
      showResults(score);
  }
}

function showQuestion(index) {
  questionContainer.textContent = `Question ${index + 1}: ${questions[index].question}`;
  optionsContainer.innerHTML = "";

  questions[index].options.forEach((option, optionIndex) => {
      const label = document.createElement("label");
      label.innerHTML = `<input type="radio" name="answer" value="${String.fromCharCode(97 + optionIndex)}"> ${String.fromCharCode(97 + optionIndex)}) ${option}`;
      optionsContainer.appendChild(label);
  });
}

function showResults(score) {
  document.getElementById("quiz").style.display = "none";
  document.getElementById("results").style.display = "block";
  scoreSpan.textContent = score;
}

showQuestion(currentQuestion);

const nextPElections = [
  "2024-11-05",
  "2028-11-07",
  "2032-11-02",
  "2036-11-04",
  "2040-11-06",
  "2044-11-08",
]
const nextGElections = [
  "2024-11-05",
  "2026-11-03",
  "2028-11-07",
  "2030-11-05",
  "2032-11-02",
  "2034-11-07",
  "2036-11-04",
  "2038-11-02",
  "2040-11-06",
  "2042-11-04",
  "2044-11-08",
]

function getBirthday() {
  if (localStorage.getItem("user") != null){
    email = localStorage.getItem("user")
    user = email.replaceAll(".","").replaceAll("#","").replaceAll("$",'').replaceAll("[","").replaceAll("]","")
    user = user.substring(0,user.indexOf("@"));
    database.ref(user+'/info').once('value').then((snapshot)=>{ 
      data = snapshot.val();
      birthdate = data.birthdate;

    })
  }
  else {
    return '1980-01-01';
  }
}

function nextLegalGeneralElection(){
  if (localStorage.getItem("user") != null){
    email = localStorage.getItem("user")
    user = email.replaceAll(".","").replaceAll("#","").replaceAll("$",'').replaceAll("[","").replaceAll("]","")
    user = user.substring(0,user.indexOf("@"));
    database.ref(user+'/info').once('value').then((snapshot)=>{ 
      data = snapshot.val();
      birthdate = data.birthdate;
      const birthday = new Date(birthdate);
      // console.log(birthday.toLocaleDateString());
      let nextDate = new Date(nextGElections[0]);
      // console.log(nextDate - birthday);
      let i = 0;
      while (nextDate - birthday < (18 * 365 + 2) * 1000 * 60 * 60 * 24){
        i++;
        nextDate = new Date(nextGElections[i]);
      }

      const currentDate = new Date();
      const targetDate = new Date(nextGElections[i]); //fixed election date
      document.getElementById("nextLGT").innerHTML = `Next Election (${targetDate.toLocaleDateString()}) in:`;
      const timeDifference = targetDate - currentDate;
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hoursDifference = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutesDifference = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const secondsDifference = Math.floor((timeDifference % (1000 * 60)) / 1000);

      document.getElementById("nextLGTimer").textContent = `${daysDifference}d ${hoursDifference}h ${minutesDifference}m ${secondsDifference}s`;
    })
  }
  else {
    const currentDate = new Date();
    let nextDate = new Date(nextGElections[0]);
    let i = 0;
    while (nextDate - currentDate <= 0){
      i++;
      nextDate = new Date(nextGElections[i]);
    }
    
    const targetDate = new Date(nextGElections[i]); //fixed election date
    document.getElementById("nextGT").innerHTML = `Next General Election You Qualify to Vote in (${targetDate.toLocaleDateString()}):`;
    const timeDifference = targetDate - currentDate;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hoursDifference = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesDifference = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const secondsDifference = Math.floor((timeDifference % (1000 * 60)) / 1000);

    document.getElementById("nextGTimer").textContent = `${daysDifference}d ${hoursDifference}h ${minutesDifference}m ${secondsDifference}s`;
  }
}

function nextGeneralElection(){
  const currentDate = new Date();
  let nextDate = new Date(nextGElections[0]);
  let i = 0;
  while (nextDate - currentDate <= 0){
    i++;
    nextDate = new Date(nextGElections[i]);
  }
  
  const targetDate = new Date(nextGElections[i]); //fixed election date
  document.getElementById("nextGT").innerHTML = `Next General Election (${targetDate.toLocaleDateString()}) in:`;
  const timeDifference = targetDate - currentDate;
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hoursDifference = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesDifference = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const secondsDifference = Math.floor((timeDifference % (1000 * 60)) / 1000);

  document.getElementById("nextGTimer").textContent = `${daysDifference}d ${hoursDifference}h ${minutesDifference}m ${secondsDifference}s`;
}

function nextLegalPresidentialElection(){
  if (localStorage.getItem("user") != null){
    email = localStorage.getItem("user")
    user = email.replaceAll(".","").replaceAll("#","").replaceAll("$",'').replaceAll("[","").replaceAll("]","")
    user = user.substring(0,user.indexOf("@"));
    database.ref(user+'/info').once('value').then((snapshot)=>{ 
      data = snapshot.val();
      birthdate = data.birthdate;
      const birthday = new Date(birthdate);
      // console.log(birthday.toLocaleDateString());
      let nextDate = new Date(nextPElections[0]);
      // console.log(nextDate - birthday);
      let i = 0;
      while (nextDate - birthday < (18 * 365 + 2) * 1000 * 60 * 60 * 24){
        i++;
        nextDate = new Date(nextPElections[i]);
      }
      // console.log(nextGElections[i]);
      // return nextGElections[i];
      const currentDate = new Date();
      const targetDate = new Date(nextPElections[i]); //fixed election date
      document.getElementById("nextLPT").innerHTML = `Next Presidential Election (${targetDate.toLocaleDateString()}) in:`;
      const timeDifference = targetDate - currentDate;
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hoursDifference = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutesDifference = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const secondsDifference = Math.floor((timeDifference % (1000 * 60)) / 1000);

      document.getElementById("nextLPTimer").textContent = `${daysDifference}d ${hoursDifference}h ${minutesDifference}m ${secondsDifference}s`;
    })
  }
  else {
    const currentDate = new Date();
    let nextDate = new Date(nextPElections[0]);
    let i = 0;
    while (nextDate - currentDate <= 0){
      i++;
      nextDate = new Date(nextPElections[i]);
    }
    
    const targetDate = new Date(nextPElections[i]); //fixed election date
    document.getElementById("nextLPT").innerHTML = `Next Presidential Election (${targetDate.toLocaleDateString()}) in:`;
    const timeDifference = targetDate - currentDate;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hoursDifference = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesDifference = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const secondsDifference = Math.floor((timeDifference % (1000 * 60)) / 1000);

    document.getElementById("nextLPTimer").textContent = `${daysDifference}d ${hoursDifference}h ${minutesDifference}m ${secondsDifference}s`;
  }
}

function nextPresidentialElection(){
  const currentDate = new Date();
  let nextDate = new Date(nextPElections[0]);
  let i = 0;
  while (nextDate - currentDate <= 0){
    i++;
    nextDate = new Date(nextPElections[i]);
  }
  
  const targetDate = new Date(nextPElections[i]); //fixed election date
  document.getElementById("nextPT").innerHTML = `Next Presidential Election (${targetDate.toLocaleDateString()}):`;
  const timeDifference = targetDate - currentDate;
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hoursDifference = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesDifference = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const secondsDifference = Math.floor((timeDifference % (1000 * 60)) / 1000);

  document.getElementById("nextPTimer").textContent = `${daysDifference}d ${hoursDifference}h ${minutesDifference}m ${secondsDifference}s`;
}

setInterval(nextGeneralElection, 1000); // Update every 1 second
setInterval(nextLegalGeneralElection, 1000);
setInterval(nextPresidentialElection, 1000);
setInterval(nextLegalPresidentialElection, 1000);
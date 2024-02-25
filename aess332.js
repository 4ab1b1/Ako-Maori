function showPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');
    document.getElementById(pageName).style.display = 'block';
}

function showHomepage(){
    document.querySelector('.home').style.display = 'block';
    document.querySelector('.page').style.display = 'none';

}

//FETCH THE VERSION DONT TOUCH
fetch("https://cws.auckland.ac.nz/ako/api/Version")
    .then(response => response.text())
    .then(data => {
        
        document.getElementById("version").textContent = data;
    })
    .catch(error => {
        console.error("Error fetching version:", error);
    });

function initializeWebsite() {
    document.getElementById('guestbook').style.display = 'none';
    
    showPage('homepage');
}


//STUFF FOR COMMENTS ITS PERFECT DONT TOUCH
    const userInput = document.getElementById("userInput");
    const commentInput = document.getElementById("commentInput");
    const submitComment = document.getElementById("submitComment");
    const commentsDisplay = document.getElementById("comments");

    submitComment.addEventListener("click", function () {
        const name = userInput.value;
        const comment = commentInput.value;

        const newComment = {
            name: name,
            comment: comment
        };

        const fetchPromise = fetch("https://cws.auckland.ac.nz/ako/api/Comment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newComment)
        })

        fetchPromise.then((response)=>{
            if (response.ok){
                
                userInput.value = "";
                commentInput.value = "";
                const iframe = document.getElementById("commentsFrame");
        
                iframe.src = iframe.src;
            }
        })
        
        });

    document.addEventListener("DOMContentLoaded", function () {
        initializeWebsite();
    });
  
//REGISTRATION STUFF DONT TOUCH 
    const usernameInput = document.getElementById("register_user");
    const passwordInput = document.getElementById("register_password");
    const addressInput = document.getElementById("register_address");
    const submitReg = document.getElementById("submitRegistration");

    submitReg.addEventListener("click", function (event) {
      event.preventDefault(); 
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const address = addressInput.value.trim();

        const newRegistration = {
            username: username,
            password: password,
            address: address
        };

        const fetchPromise = fetch('https://cws.auckland.ac.nz/ako/api/Register', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRegistration)
        })

        fetchPromise.then((response)=>{
            if (response.ok){
                
                document.getElementById("register_user").value = '';
                document.getElementById("register_password").value = '';
                document.getElementById("register_address").value = '';
                showAlert(`${username} has been registered!`);
            }

            else{
                console.error("Registration failed with status code: " + response.status);
            }

            
        })

    })

  //LOGIN STUFF DONT TOUCH IT WORKS PERFECTLY need to add stuff for logout
  document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); 

    const username = document.getElementById("login_user").value;
    const password = document.getElementById("login_password").value;
    const fetchPromise = fetch("https://cws.auckland.ac.nz/ako/api/TestAuth",
    {
        headers: {
            "Authorization": "Basic " + btoa(`${username}:${password}`)
          },
        });

    const streamPromise = fetchPromise.then((response) =>{
        if (response.ok)
        {
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            document.getElementById("login_user").value = '';
            document.getElementById("login_password").value = '';
            document.getElementById("loginStatus").innerHTML = `Hello, ${username}! Welcome Back! (<a href="#" id="logoutButton">logout</a>)`;
            showPage('homepage');
        }
        else {
            showAlert("Username and/or Password may be incorrect, please try again.");
        }

        //LOGOUT STUFF
        const logoutButton = document.getElementById('logoutButton');

  logoutButton.addEventListener('click', function(event) {
    event.preventDefault();
      localStorage.setItem('username', null);
      localStorage.setItem('password', null);
      document.getElementById("loginStatus").innerHTML = 'Not Logged In';
      showAlert("You have logged out.");
      showPage('login');
  });

    })
  
  });
  
  //SHOP STUFF DONT TOUCH IT WORKS FINE
  fetch('https://cws.auckland.ac.nz/ako/api/AllItems')
  .then (response =>{
    return response.json();
  })
  .then(data => {
    const productContainer = document.getElementById("productContainer");
    data.forEach(product => {
        const productCard = document.createElement('div');
      productCard.classList.add('productCard');

      fetch(`https://cws.auckland.ac.nz/ako/api/ItemImage/${product.id}`)
        .then(imageResponse => imageResponse.blob())
        .then(imageBlob => {
          const productImage = document.createElement('img');
          productImage.src = URL.createObjectURL(imageBlob);
          productImage.alt = product.name;

          productCard.querySelector('.productImage').appendChild(productImage);

        })

      productCard.innerHTML = `
        <div class="productImage">
        </div>
        <div class="productInfo">
          <div class="productText">
            <h1 class="productName">${product.name}</h1>
            <p class="productDescription">${product.description}</p>
          </div>
          <div class="productPriceButton">
            <p>$${product.price}</p>
            <button type="button" class="signin" onclick="buyProduct('${product.name}')">Buy Now</button>
          </div>
        </div>
      `;

      productContainer.appendChild(productCard);

    });
    // console.log(data);
  })
  .catch(error => console.log(error));

//DYNAMIC SEARCH
document.addEventListener('DOMContentLoaded', function () {
  
    var searchBar = document.querySelector('.searchBar');

    searchBar.addEventListener('keyup', function () {
        
        var searchTerm = searchBar.value.toLowerCase();
        var productCard = document.querySelectorAll('.productCard');

        productCard.forEach(function (element) {
            var productName = element.textContent.toLowerCase();
            element.style.display = 'block';

            if (productName.indexOf(searchTerm) === -1) {
                element.style.display = 'none';
            }
        });
    });
});

//FUNCTION TO MAKE AN ALERT
function showAlert(message) {
    var modal = document.getElementById("myModal");
    var alertMessage = document.getElementById("alert-message");
    alertMessage.textContent = message;
    modal.style.display = "block";
  }
  
  
  function closeAlert() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
  }

  function buyProduct(productName) {
    
    const loginStatus = document.getElementById("loginStatus").innerHTML;
    const localuser = localStorage.getItem('username');
    if (loginStatus == `Hello, ${localuser}! Welcome Back! (<a href="#" id="logoutButton">logout</a>)`){
        const purchaseSuccessful = true;
        if (purchaseSuccessful) {
            showAlert(`You have successfully purchased ${productName}!`);
          } else {
            showAlert(`Failed to purchase ${productName}. Please try again.`);
          }
    }
    else{
        showAlert("Please log in to make a purchase.");
        showPage('login');
    }
    
  }


//EVENT STUFF DONT TOUCH IT WORKS
function iCalDateToDate(icalDate) {

  const year = parseInt(icalDate.substr(0, 4));
  const month = parseInt(icalDate.substr(4, 2)) - 1; 
  const day = parseInt(icalDate.substr(6, 2));
  const hours = parseInt(icalDate.substr(9, 2));
  const minutes = parseInt(icalDate.substr(11, 2));
  const seconds = parseInt(icalDate.substr(13, 2));

  const date = new Date(year, month, day, hours, minutes, seconds);
  date.setHours(date.getHours() + 12);

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  const formattedDate = date.toLocaleDateString(undefined, options);
  return formattedDate;
}


// Function to parse iCalendar data
function parseICal(icalData) {
    const events = [];
    const lines = icalData.split('\n');
    let currentEvent = {};
  
    lines.forEach(line => {
      if (line.startsWith("BEGIN:VEVENT")) {
        currentEvent = {};
      } else if (line.startsWith("END:VEVENT")) {
        events.push(currentEvent);
      } else {
        const [key, value] = line.split(":");
        if (key && value) {
          currentEvent[key] = value;
        }
      }
    });
  
    return events;
  }

  function fetchAndDisplayEvent(eventId) {
    return fetch(`https://cws.auckland.ac.nz/ako/api/Event/${eventId}`)
        .then(response => response.text()) 
        .then(eventData => {
            const events = parseICal(eventData);
            const eventContainer = document.getElementById("eventContainer");

            events.forEach(event => {
                const eventCard = document.createElement('div');
                eventCard.classList.add('eventCard');

                const startDate = iCalDateToDate(event.DTSTART);
                const endDate = iCalDateToDate(event.DTEND);

                eventCard.innerHTML = `
                    <h1 class="eventName">${event.SUMMARY}</h1>
                    <br>
                    <h4>Details:</h4>
                    <p class="eventDescription">${event.DESCRIPTION}</p>
                    <h4>Location:</h4>
                    <p class="eventLocation">${event.LOCATION}</p>
                    <br>
                    <h4>Time:</h4>
                    <p class="eventStart"><b>Start:</b> ${startDate.toLocaleString()}</p>
                    <p class="eventEnd"><b>End:</b> ${endDate.toLocaleString()}</p>
                    <button type="button" class="signin eventButton" onclick = "window.location.href='https://cws.auckland.ac.nz/ako/api/Event/${eventId}'">Add Event to Calender</button>
                `;

                eventContainer.appendChild(eventCard);
            });
        })
        .catch(error => console.log(error));
}

fetch("https://cws.auckland.ac.nz/ako/api/EventCount")
    .then(response => response.json()) 
    .then(data => {
        console.log(data);
        const totalCount = Number.parseInt(data);

        for (let eventId = 0; eventId < totalCount; eventId++) {
            fetchAndDisplayEvent(eventId);
        }
    })
    .catch(error => console.log(error));

  //GAME STUFF TBC
  
    document.addEventListener("DOMContentLoaded", function () {
        initializeWebsite();

    });

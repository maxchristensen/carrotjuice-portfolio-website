/*jshint esversion: 6 */
$(document).ready(function() {
    let url;
    let currentSelectedUser;


// Get Config.Json and variable from it
$.ajax({
    url: 'config.json',
    type: 'GET',
    dataType: 'json',
    success: function(configData){
        console.log(configData.SERVER_URL, configData.SERVER_PORT);
        url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`;
        console.log('working');
       getAllProjects();
       

       
    },
    error: function(error){
        console.log(error);
    }
});


function user (id, firstName, lastName, email, password, userImage, git, twitter, instagram, linkedin, external ){
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.userImage = userImage;
    this.git = git;
    this.twitter = twitter;
    this.instagram = instagram;
    this.linkedin = linkedin;
    this.external = external;
}

function getAllProjects () {
   
    $.ajax({
        url: `http://${url}/allPortfolios`,
        type: 'GET',
        dataType: 'json',
        success: function(productsFromMongo) {
            let projectsContainer =  document.getElementById('projectsContainer');
           projectsContainer.innerHTML = '';

            for(let i = 0; i < productsFromMongo.length; i++ ){
                let project = productsFromMongo[i];
                let createdBy = productsFromMongo[i].user_id;
                let projectNumber;
                if (i < 9){
                    projectNumber = "0" + (i+1)

                } else {
                    projectNumber = i+1;
                }
                 
                projectsContainer.innerHTML += `
                <div class="project-listing " data-id=${project._id}>

                <div class="name-container">
                    <h6 class="project-info number">${projectNumber}.</h6>
                <h6 class="project-info title">${project.title}</h6>
                </div>
                
                
                <h6 class="project-info author"> ${project.author}</h6>
               
            </div>
                `;
                openProject();
                
            }
        },
        error: function() {
            alert('unable to get products');
        }
    });
    
}




function getSingleProject(id){

    $.ajax({
        url: `http://${url}/singlePortfolio/${id}`,
        type: 'GET',
        dataType: 'json',
        success: function (portfolio){
            
            let userID = portfolio.user_id;
// retrieving and setting current user details
            $.ajax({
                url: `http://${url}/allUsers`,
                type: 'GET',
                dataType: 'json',
                success: function (students){
                    for(let i = 0; i < students.length; i++ ){
                        
                        let student = students[i];
                        
                        if(userID == student._id){
                            currentSelectedUser = new user(student.id, student.firstName, student.lastName, student.email, student.password, student.userImage, student.git, student.twitter, student.instagram, student.linkedin, student.external)
                            console.log(currentSelectedUser);
                        }
        
        
                    }
        
                },
                error: function() {
                    alert('unable to get user');
                }
        });
        populatingContent(portfolio);
        

        },
        error: function() {
            alert('unable to get products');
        }

        

})


}



function populatingContent(portfolio){
    let projectInfoContainer = document.getElementById('projectInfoContainer')
    let side1 = document.getElementById('side1');
    let side2 = document.getElementById('side2');
    let linksContainer = document.getElementById('linksContainer');


    console.log('in populating');
    console.log(currentSelectedUser);

    side1.innerHTML = `
    <div class="project-title"><h4>${portfolio.title}</h4></div>
    <div class="project-image">
        <img src="${portfolio.imageURL}" >
    </div>
    `

   side2.innerHTML = `
   <div class="project-author student-name">${portfolio.author}</div>
   <div class="project-description">
       <p>${portfolio.description}</p>
       
   </div>
   <div class="links-container" id="linksContainer">

        
        </div>
   `
   
    //   if(typeof currentSelectedUser.twitter !== 'undefined'){
    //         linksContainer.innerHTML += `
    //         <a href="${currentSelectedUser.twitter}"><i class="fa-brands fa-twitter"></i></a>
    //         `

    //        } 
           if(!currentSelectedUser.instagram == ''){
            linksContainer.innerHTML += `
            <a href="${currentSelectedUser.instagram}"><i class="fa-brands fa-instagram"></i></a>
            `
           } if(!currentSelectedUser.linkedin == ' '){
            linksContainer.innerHTML += `
            <a href="${currentSelectedUser.linkedin}"><i class="fa-brands fa-linkedin"></i></a>
            `

           } 
        if(!currentSelectedUser.git == ' '){
            linksContainer.innerHTML += `
            <a href="${currentSelectedUser.git}"><i class="fa-brands fa-github"></i></a>
            `
            
           } 
           if(!currentSelectedUser.external == ''){
            linksContainer.innerHTML += `
            <a href="${currentSelectedUser.external}"><i class="fa-brands fa-globe"></i></a>
            `
           }
           


}

async function setCurrentSelectedUser(id){
    
    $.ajax({
        url: `http://${url}/allUsers`,
        type: 'GET',
        dataType: 'json',
        success: function (students){
            for(let i = 0; i < students.length; i++ ){
                console.log('in success');
                let student = students[i];
                // console.log(student);
                // console.log(id);

                if(id == student._id){
                    // console.log(student);
                    
           currentSelectedUser = new user(student.id, student.firstName, student.lastName, student.email, student.password, student.userImage, student.git, student.twitter, student.instagram, student.linkedin, student.external)
        //    console.log(currentSelectedUser);
                }


            }

        },
        error: function() {
            alert('unable to get user');
        }
});
}

function openProject() {
    let allListings =  document.querySelectorAll('.project-listing');
    let listings = Array.from(allListings);

    

    listings.forEach(function(listing){
        listing.addEventListener('click', function (){
            console.log('clicked');
            let projectID = listing.dataset.id;
            getSingleProject(projectID)

        });
        // listing.addEventListener('mouseover', function(){
        //     let projectID = listing.dataset.id;
        //     singleProjectHover(projectID)
        // })
        // listing.addEventListener('mouseout', function(){
        //     let image = document.getElementById('projectImage');
        //    image.innerHTML = `
        //    <img src="" >
        //    `
        // })
    })
}

function singleProjectHover(id){
    $.ajax({
        url: `http://${url}/singlePortfolio/${id}`,
        type: 'GET',
        dataType: 'json',
        success: function (portfolio){
           let image = document.getElementById('projectImage');
           image.innerHTML = `
           <img src="${portfolio.imageURL}" >
           `

           
        },
        error: function() {
            // alert('its not working');
        }


})

}




// ------------ TAB SELECTION LOGIC -------------

let activeTab = 'tabAll';




function allTab (){

}

function changeTab (tabName){
    

    let prevTab = document.getElementById(activeTab);
    prevTab.classList.remove('active');
    activeTab = tabName;
    let tab = document.getElementById(activeTab);
    tab.classList.add('active');
    console.log(`tab ${activeTab} is selected`);
    


    
}

function tabsClickable (){

    let allTabs = document.querySelectorAll('.tab');
    let tabs = Array.from(allTabs);
    tabs.forEach(function (tab){
        tab.addEventListener('click', event => {
            let tabName = event.target.id;
           
            changeTab(tabName)
        })
        
    })
}





document.getElementById('sidenavTab').addEventListener('click', function (){
    const sideNav = document.getElementById('sidenav');
    const backgroundBlur = document.getElementById('backgroundBlur')

    if (!sideNav.classList.contains('open')){
        backgroundBlur.classList.remove('hidden')
        sideNav.classList.remove('closed')
        sideNav.classList.add('open')
    } else {
        backgroundBlur.classList.add('hidden')
        sideNav.classList.remove('open')
        sideNav.classList.add('closed')
       
    }
    
}) ;

tabsClickable();



// ------------ VISUALS -----------------



});






// ------------- LOADING PAGE ANIMATION -----------------

// function which checks every 2.5 secs to see if body loaded is "not undefined" - if body "not undefined", this means page load is complete, so clear the interval and break out of the function 
function onReady(callback) {
    let intervalId = window.setInterval(function () {
        if (document.getElementsByTagName('body')[0] !== undefined) {
            window.clearInterval(intervalId);
            callback.call(this);
        }
    }, 2500);
}
// function accepts 2 parameters - the selector and whether to that selector to visible or not. It uses a ternary operator, which says "if visible is true, then set the display attribute for that selector to block, otherwise set its display attribute to none" 
function setVisible(selector, visible) {
    document.querySelector(selector).style.visibility = visible ? 'visible' : 'hidden';
}

// call onReady, passing:
//      1. name of the selector and 
//      2. whether to display its content
// Once page loaded, set the loading page display to none and the document to display block
onReady(function () {
    setVisible('.after-loading-page', true);
    setVisible('#loading', false);
});

// ------------- End of LOADING PAGE ANIMATION -----------------



/*jshint esversion: 6 */
$(document).ready(function () {
    let url;
    let currentSelectedUser;


    // Get Config.Json and variable from it
    $.ajax({
        url: 'config.json',
        type: 'GET',
        dataType: 'json',
        success: function (configData) {
            console.log(configData.SERVER_URL, configData.SERVER_PORT);
            url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`;

            getAllProjects();



        },
        error: function (error) {
            console.log(error);
        }
    });





    function getAllProjects() {

        $.ajax({
            url: `http://${url}/allPortfolios`,
            type: 'GET',
            dataType: 'json',
            success: function (productsFromMongo) {
                let projectsContainer = document.getElementById('projectsContainer');
                projectsContainer.innerHTML = '';

                for (let i = 0; i < productsFromMongo.length; i++) {
                    let project = productsFromMongo[i];
                    let createdBy = productsFromMongo[i].user_id;
                    let projectNumber;
                    if (i < 9) {
                        projectNumber = "0" + (i + 1);

                    } else {
                        projectNumber = i + 1;
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
            error: function () {
                alert('unable to get all portfolios');
            }
        });

    }




    function getSingleProject(id) {

        $.ajax({

            url: `http://${url}/singlePortfolio/${id}`,
            type: 'GET',
            dataType: 'json',
            success: async function (portfolio) {


                let userID = portfolio.user_id;
                const selectedUser = await getSingleUser(userID);
                // retrieving and setting current user details



                populatingContent(portfolio, selectedUser);


            },
            error: function () {
                alert('unable to get single portfolio');
            }





        });

    }

    
    function singleProjectHover(id) {
        $.ajax({
            url: `http://${url}/singlePortfolio/${id}`,
            type: 'GET',
            dataType: 'json',
            success: function (portfolio) {
                let image = document.getElementById('projectImage');
                image.innerHTML = `
           <img src="${portfolio.imageURL}" >
           `;


            },
            error: function () {
                // alert('its not working');
            }


        });
    }

    async function getSingleUser(id) {

        let user;

        try {
            user = await $.ajax({
                url: `http://${url}/singleUser/${id}`,
                type: 'GET',
                dataType: 'json',

            })
            console.log(user);
            return user;

        } catch (error) {
            console.error(error)
        }

    }



    function populatingContent(portfolio, selectedUser) {
        let projectInfoContainer = document.getElementById('projectInfoContainer')
        let side1 = document.getElementById('side1');
        let side2 = document.getElementById('side2');


        // console.log(currentSelectedUser);

        side1.innerHTML = `
    <div class="project-title"><h4>${portfolio.title}</h4></div>
    <div class="project-image" id="projectImage">
       
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
        let projectImage = document.getElementById('projectImage');
        let linksContainer = document.getElementById('linksContainer');
        projectImage.style.backgroundImage = `url(${portfolio.imageURL})`

        if (selectedUser.twitter !== '') {
            linksContainer.innerHTML += `
            <a href="${selectedUser.twitter}"><i class="fa-brands fa-twitter link"></i></a>
            `

        }
        if (!selectedUser.instagram == '') {
            linksContainer.innerHTML += `
            <a href="${selectedUser.instagram}"><i class="fa-brands fa-instagram link"></i></a>
            `
        }
        if (!selectedUser.linkedIn == '') {
            linksContainer.innerHTML += `
            <a href="${selectedUser.linkedIn}"><i class="fa-brands fa-linkedin link"></i></a>
            `

        }
        if (!selectedUser.gitLink == '') {
            linksContainer.innerHTML += `
            <a href="${selectedUser.gitLink}"><i class="fa-brands fa-github link"></i></a>
            `

        }
        if (!selectedUser.externalSite == '') {
            linksContainer.innerHTML += `
            <a href="${selectedUser.externalSite}"><i class="fa-brands fa-globe link"></i></a>
            `
        }



    }


    function openProject() {
        let allListings = document.querySelectorAll('.project-listing');
        let listings = Array.from(allListings);



        listings.forEach(function (listing) {
            listing.addEventListener('click', function () {
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

    async function populateUserBio(userID){
        let side2 = document.getElementById('side2');
                const user = await getSingleUser(userID)
                side2.innerHTML = `
                    <div class="project-author student-name">${user.firstName} ${user.lastName}</div>
                        <div class="project-description">
                           <p> ${user.bio}</p>
       
                            </div>
                        <div class="links-container" id="linksContainer">

        
                    </div>
                `

                let linksContainer = document.getElementById('linksContainer');

                if (user.twitter !== '') {
                    linksContainer.innerHTML += `
                    <a href="${user.twitter}"><i class="fa-brands fa-twitter link"></i></a>
                    `
        
                }
                if (!user.instagram == '') {
                    linksContainer.innerHTML += `
                    <a href="${user.instagram}"><i class="fa-brands fa-instagram link"></i></a>
                    `
                }
                if (!user.linkedIn == '') {
                    linksContainer.innerHTML += `
                    <a href="${user.linkedIn}"><i class="fa-brands fa-linkedin link"></i></a>
                    `
        
                }
                if (!user.gitLink == '') {
                    linksContainer.innerHTML += `
                    <a href="${user.gitLink}"><i class="fa-brands fa-github link"></i></a>
                    `
        
                }
                if (!user.externalSite == '') {
                    linksContainer.innerHTML += `
                    <a href="${user.externalSite}"><i class="fa-brands fa-globe link"></i></a>
                    `
                }



    }








    function getSingleStudentProjects(userID) {
        $.ajax({
            url: `http://${url}/allPortfolios`,
            type: 'GET',
            dataType: 'json',
            success: async function (productsFromMongo) {
                await populateUserBio(userID)


                let projectsContainer = document.getElementById('projectsContainer');
                projectsContainer.innerHTML = '';

                for (let i = 0; i < productsFromMongo.length; i++) {
                    let project = productsFromMongo[i];
                    let createdBy = productsFromMongo[i].user_id;
                    let projectNumber;



                    if (userID === createdBy) {
                        if (i < 9) {
                            projectNumber = "0" + (i + 1)

                        } else {
                            projectNumber = i + 1;
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


                }
            },
            error: function () {
                alert('unable to get single students portfolio');
            }
        });
    }












    // ------------ TAB SELECTION LOGIC -------------

    let activeTab = 'tabAll';
    let activeResponsiveTab = 'tabAll'


    function changeTab(tabName) {



        // Setting the previous tab
        let prevTab = document.getElementById(activeTab);
        let prevTabName = prevTab.dataset.name + "-background"
        // prevTab.classList.remove('active');
        prevTab.classList.remove(prevTabName);

        // Setting the active tab
        activeTab = tabName;
        let tab = document.getElementById(activeTab);

        let activeTabName = tab.dataset.name + "-background"
        // tab.classList.add('active');
        tab.classList.add(activeTabName);

        let userID = tab.dataset.userid;



        if (activeTab === 'tabAll') {
            let side1 = document.getElementById('side1');
            let side2 = document.getElementById('side2');
            side1.innerHTML = '';
            side2.innerHTML = '';
            getAllProjects();
        } else {
            getSingleStudentProjects(userID);
            side1.innerHTML = '';
        }

    }








    function changeDropdownTab(tabName) {
        let prevTab = document.getElementById(activeResponsiveTab);
        let prevTabName = prevTab.dataset.background + "-background";

        let nameTab = document.getElementById('tabResponsiveName');
        nameTab.classList.remove(prevTabName);

        activeResponsiveTab = tabName;
        let tab = document.getElementById(activeResponsiveTab);

        let responsiveNav = document.getElementById('dropdownContainer');
        let dropdownTab = document.getElementById('tabDropdown')

        let userID = tab.dataset.userid;
        let name = tab.dataset.background;
        let tabBackground = name + '-background'
        nameTab.classList.add(tabBackground);


        if (tabName === 'dropdownTabAll') {
            let side1 = document.getElementById('side1');
            let side2 = document.getElementById('side2');
            side1.innerHTML = '';
            side2.innerHTML = '';
            getAllProjects();
        } else {
            side1.innerHTML = '';
            getSingleStudentProjects(userID);
        }




        nameTab.innerHTML = `${name}`;
        responsiveNav.classList.add('hiddenMenu');
        dropdownTab.style.backgroundColor = '$white';
        dropdownTab.style.color = '$black';


    }






    function tabsClickable() {

        let allTabs = document.querySelectorAll('.tab');
        let tabs = Array.from(allTabs);
        tabs.forEach(function (tab) {
            tab.addEventListener('click', event => {
                console.log(tab);
                let tabName = event.target.id;

                changeTab(tabName);
            });

        });

    }

    function dropdownClickable() {

        let allDropdownTabs = document.querySelectorAll('.dropdown-tab');
        let dropdownTabs = Array.from(allDropdownTabs);
        dropdownTabs.forEach(function (tab) {
            tab.addEventListener('click', event => {
                let tabName = event.target.id;
                changeDropdownTab(tabName);
            });

        });

    }



    document.getElementById('sidenavTab').addEventListener('click', function () {

        console.log('sidebar clicked');
        const sideNav = document.getElementById('sidenav');
        const backgroundBlur = document.getElementById('backgroundBlur');

        if (!sideNav.classList.contains('open')) {

            backgroundBlur.classList.remove('hidden');
            sideNav.classList.remove('closed');
            sideNav.classList.add('open');
        } else {
            backgroundBlur.classList.add('hidden');
            sideNav.classList.remove('open');
            sideNav.classList.add('closed');
        }

    });

    // ------------ VISUALS -----------------

    function populateUserInfo(user) {
        console.log(user);

        let firstName = user.firstName;
        let lastName = user.lastName;
        let email = user.email;
        let password = user.password;
        let userImage = user.userImage;
        let gitLink = user.gitLink;
        let linkedIn = user.linkedIn;
        let instagram = user.instagram;
        let twitter = user.twitter;
        let externalSite = user.externalSite;


        if (userImage == '') {
            userImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        }

        console.log(userImage);
        let sideNav = document.getElementById('sidenavContent');



        sideNav.innerHTML = `
        
    <div class="user-details-container">

    <h4>Good to see you back ${firstName}</h4>
        <div class="top-container">

            <div class="user-image" id='userImage'></div>
            <div class="user-name"><h3>${firstName} ${lastName}</h3></div>
            
        </div>
        <div class="info-container" id="infoContainer">
           
        </div>
        <button id="addProject" class="login-message login-button">Add Project</button>

    </div>
        
        `
        let userImg = document.getElementById('userImage');
        userImg.style.backgroundImage = `url(${userImage})`;

        let infoContainer = document.getElementById("infoContainer");

        if (gitLink != '') {
            infoContainer.innerHTML += `
                        <div class="social-media-button"> <a href="${gitLink}" target="_blank" title="GitHub"><i class="fa-brands fa-github"></i></a> </div>
                `
        }
        if (linkedIn != '') {
            infoContainer.innerHTML += `
                        <div class="social-media-button"> <a href="${linkedIn}" target="_blank" title="Linked In"><i class="fa-brands fa-linkedin"></i></a> </div>
                `
        }
        if (instagram != '') {
            infoContainer.innerHTML += `
                        <div class="social-media-button"> <a href="${instagram}" target="_blank" title="Instagram"><i class="fa-brands fa-instagram"></i></a> </div>
                `
        }
        if (twitter != '') {
            infoContainer.innerHTML += `
                        <div class="social-media-button"> <a href="${twitter}" target="_blank" title="Twitter"><i class="fa-brands fa-twitter"></i></a> </div>
                `
        }
        if (externalSite != '') {
            infoContainer.innerHTML += `
                        <div class="social-media-button"> <a href="${externalSite}" target="_blank" title="Follow this link to view more of ${firstName}'s work"><i class="fa-solid fa-arrow-up-right-from-square"></i></a> </div>
                `
        }

        document.getElementById('sidenavTab').innerHTML = 'add';

        addNewProject(user, firstName);

    }



    function addNewProject(currentUser, firstName) {
        // * on click of the add project button, display add project form
        let sideNav = document.getElementById('sidenavContent');
        const addProject = document.getElementById('addProject');
        addProject.addEventListener('click', function () {
            sideNav.innerHTML = `
                                <div id="inputProjectDetails" class="input-Project-details">
                                    <br>
                                    <input class="input" type="text" id="projectName" placeholder="project name">
                                    <input class="input" type="text" id="projectDesc" placeholder="project description">
                                    <input class="input" type="text" id="projectURL" placeholder="link to project image">
                                    <input class="input" type="text" id="projectSite" placeholder="link to project site">
                                    <br><br>
                                    <button id="submitAddProject" class="login-button">ADD PROJECT NOW</button>
                                </div>
                                `
            // ** on click of the submit new project button, do an ajax call to add the project to the mongo DB
            const submitAddProject = document.getElementById('submitAddProject');
            submitAddProject.addEventListener('click', function () {
                const newProjName = projectName.value;
                const newProjDesc = projectDesc.value;
                const newProjURL = projectURL.value;
                const newProjSite = projectSite.value;
                const newProjCreateDate = new Date;
                const newProjCreator = sessionStorage.getItem('userID');
                const newProjAuthor = `${sessionStorage.getItem('firstName')} ${sessionStorage.getItem('lastName')}`;;
                console.log(newProjName);
                console.log(newProjDesc);
                console.log(newProjCreator);
                console.log('you have added a new project with the name "' + newProjName + '", description "' + newProjDesc + '"');
                // *** Start of ajax POST
                $.ajax({
                    url: `http://${url}/addPortfolio`,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        title: newProjName,
                        description: newProjDesc,
                        imageUrl: newProjURL,
                        siteUrl: newProjSite,
                        creationDate: newProjCreateDate,
                        user_id: newProjCreator,
                        author: newProjAuthor
                    },
                    success: function (result) {
                        console.log(result);
                        alert("Project '" + newProjName + "' added by " + firstName);
                        populateUserInfo(currentUser);
                        return;
                    },
                    error: function () {
                        console.log('Error - cannot call API to add a new project add product');
                    }
                })
                // End of ajax POST ***
            })
            // End of ** 
        })
        // End of *
    };
    // End of addNewProject(...)




    // ------------------------------- Login Form --------------------------------------


    // Add Project function - called after user successfully logs in




    // Add event listener to the login submit button
    const loginButton = document.getElementById('submitLogin');
    loginButton.addEventListener('click', function () {

        // On click do an ajax call to the user collection and get their name to display on the welcome message
        let firstName = document.getElementById('firstName').value;
        let lastName = document.getElementById('lastName').value;
        let password = document.getElementById('password').value;


        if (firstName == '' || lastName == '' || password == '') {
            alert('Please enter all details');
        } else {

            $.ajax({
                url: `http://${url}/loginUser`,
                type: 'POST',
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    password: password
                },
                success: function (user) {

                    if (user == 'user not found. Please register') {
                        alert('User not found. Please Register');
                    } else if (user == 'not authorized') {
                        alert('Please try with correct details');
                        firstName.value('');
                        lastName.value('');
                        password.value('');
                    } else {
                        sessionStorage.setItem('userID', user['_id']);
                        sessionStorage.setItem('firstName', user['firstName']);
                        sessionStorage.setItem('lastName', user['lastName']);
                        populateUserInfo(user)

                    }
                },
                error: function () {
                    alert('Error - unable to get user details');
                }
            });

        }

    });


    document.getElementById('tabDropdown').addEventListener('click', function () {
        let responsiveNav = document.getElementById('dropdownContainer');
        let dropdownTab = document.getElementById('tabDropdown')

        if (responsiveNav.classList.contains('hiddenMenu')) {
            responsiveNav.classList.remove('hiddenMenu')
            dropdownTab.style.backgroundColor = '$black'
            dropdownTab.style.color = '$white'
        } else {
            responsiveNav.classList.add('hiddenMenu')
            dropdownTab.style.backgroundColor = '$white'
            dropdownTab.style.color = '$black'
        }
    })





    // ------------------------------- End of Login Form --------------------------------------

    tabsClickable();
    dropdownClickable();


});
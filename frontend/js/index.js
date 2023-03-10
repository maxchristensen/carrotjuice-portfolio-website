/*jshint esversion: 6 */
$(document).ready(function () {
            let url;


            // Get Config.Json and variable from it
            $.ajax({
                url: 'config.json',
                type: 'GET',
                dataType: 'json',
                success: function (configData) {
                    console.log(configData.SERVER_URL, configData.SERVER_PORT);
                    url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`;
                    console.log('working');
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
                        alert('unable to get products');
                    }
                });

            }

            function openProject() {
                let allListings = document.querySelectorAll('.project-listing');
                let listings = Array.from(allListings);



                listings.forEach(function (listing) {
                    listing.addEventListener('click', function () {
                        console.log('clicked');
                        let projectID = listing.dataset.id;
                        getSingleProject(projectID);

                    });
        //             listing.addEventListener('mouseover', function () {
        //                 let projectID = listing.dataset.id;
        //                 singleProjectHover(projectID);
        //             });
        //             listing.addEventListener('mouseout', function () {
        //                 let image = document.getElementById('projectImage');
        //                 image.innerHTML = `
        //    <img src="" >
        //    `;
        //             });
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

            function getSingleProject(id) {

                $.ajax({
                    url: `http://${url}/singlePortfolio/${id}`,
                    type: 'GET',
                    dataType: 'json',
                    success: function (portfolio) {
                        let projectInfoContainer = document.getElementById('projectInfoContainer');
                        let side1 = document.getElementById('side1');
                        let side2 = document.getElementById('side2');
                        let linksContainer = document.getElementById('linksContainer');

                        getUser(portfolio.user_id);
                        let authorTwitter = sessionStorage.getItem('currentAuthorTwitter');
                        let authorGit = sessionStorage.getItem('currentAuthorGitLink');

                        // console.log(author);


                        side1.innerHTML = `
            <div class="project-title"><h4>${portfolio.title}</h4></div>
            <div class="project-image">
                <img src="${portfolio.imageURL}" >
            </div>
            `;

                        side2.innerHTML = `
           <div class="project-author student-name"><h3>${portfolio.author}</h3></div>
           <div class="project-description">
               <p>${portfolio.description}</p>
               
           </div>
           <div class="links-container" id="linksContainer">
           <i class="fa-brands fa-instagram"></i>
           <i class="fa-brands fa-linkedin"></i>
           <i class="fa-brands fa-github"></i>
           <i class="fa-solid fa-globe"></i>
                
                </div>
           `;

                        //    if(!author.twitter == ' '){
                        //     linksContainer.innerHTML += `
                        //     <a href="${author.twitter}"><i class="fa-brands fa-twitter"></i></a>
                        //     `

                        //    } if(!author.instagram == ' '){
                        //     linksContainer.innerHTML += `
                        //     <a href="${author.instagram}"><i class="fa-brands fa-instagram"></i></a>
                        //     `
                        //    } if(!author.linkedIn == ' '){
                        //     linksContainer.innerHTML += `
                        //     <a href="${author.linkedIn}"><i class="fa-brands fa-linkedin"></i></a>
                        //     `

                        //    } 
                        // if(!authorGit == ' '){
                        //     linksContainer.innerHTML += `
                        //     <a href="${authorGit}"><i class="fa-brands fa-github"></i></a>
                        //     `

                        //    } 
                        //    if(!author.externalSite == ''){
                        //     linksContainer.innerHTML += `
                        //     <a href="${author.externalSite}"><i class="fa-brands fa-globe"></i></a>
                        //     `
                        //    }



                    },
                    error: function () {
                        alert('unable to get products');
                    }


                });
            }

            function getUser(id) {

                let author;


                $.ajax({
                    url: `http://${url}/singleUser/${id}`,
                    type: 'GET',
                    dataType: 'json',
                    success: function (user) {

        });
    }
    
    function getSingleStudentProjects(userID) {
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


                if (userID === createdBy) {
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
                
                
            }
        },
        error: function() {
            alert('unable to get products');
        }
    });
}


                        sessionStorage.setItem('currentAuthorTwitter', user.twitter);
                        sessionStorage.setItem('currentAuthorTwitter', user.instagram);
                        sessionStorage.setItem('currentAuthorGitLink', user.gitLink);


                    },
                    error: function () {
                        alert('unable to get user');
                    }


                });


            }





            // ------------ TAB SELECTION LOGIC -------------

            let activeTab = 'tabAll';




            function allTab() {

            }

            function changeTab(tabName) {



                let prevTab = document.getElementById(activeTab);
                prevTab.classList.remove('active');
                activeTab = tabName;
                let tab = document.getElementById(activeTab);
                tab.classList.add('active');
                console.log(`tab ${activeTab} is selected`);
                let userID = tab.dataset.userid;

                if (activeTab === 'tabAll') {
                    getAllProjects();
                } else {
                    getSingleStudentProjects(userID);
                }

            }

            function getSingleStudentProjects(userID) {
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
                        alert('unable to get products');
                    }
                });
            }



                function tabsClickable() {

                    let allTabs = document.querySelectorAll('.tab');
                    let tabs = Array.from(allTabs);
                    tabs.forEach(function (tab) {
                        tab.addEventListener('click', event => {
                            let tabName = event.target.id;

                            changeTab(tabName);
                        });

                    });
                }
                

    if (activeTab === 'tabAll') {
        getAllProjects();
    } else {
        getSingleStudentProjects(userID);
    }
    
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


    




                // Login Form
                // Add event listener to the submit button
                const loginButton = document.getElementById('submitLogin');
                loginButton.addEventListener('click', function() {

                        // On click do an ajax call to the user collection and get their name
                        const loginUser = document.getElementById('loginUser');
        
                        $.ajax({
                            url: `http://${url}/singleUser/${loginUser.value}`,
                            type: 'GET',
                            dataType: 'json',
                            success: function (user) {
                                const inputUserDetails = document.getElementById('inputUserDetails');
                                inputUserDetails.innerHTML = '';
                                const greetingName = user.firstName;
                                const loginMessage = document.getElementById('loginMessage');
                                loginMessage.innerHTML = `
                                <br><br>
                                <h4>Good to see you back ${greetingName}</h4>
                                <br><br>
                                <button class="login-message login-button">Add Project</button>
                                `
                            },
                            error: function () {
                                alert('unable to get user');
                            }
        
                        });

                        
                })

                // End of login form

                tabsClickable();



                // ------------ VISUALS -----------------


            });




});


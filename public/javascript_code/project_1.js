function navbar_manage() {
    let nav = document.getElementById("navbar_ul");
    if (nav.style.display === "block") {
        nav.style.display = "none";
    } else {
        nav.style.display = "block";
    }

}



    let v = document.getElementById("s");
    v.addEventListener('click', myPost);

    function myPost() {
        console.log("clicked");
    }


    v.addEventListener('mouseover', function () {
        console.log("mouseover event run");

    });
    v.addEventListener('mouseout', function () {
        console.log("mouseout event run");
    });



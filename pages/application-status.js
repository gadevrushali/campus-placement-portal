
document.addEventListener("DOMContentLoaded", function () {

    console.log("CampusHire Application Page Loaded 🚀");

    const addBtn = document.querySelector(".add");
    const modal = document.getElementById("applicationModal");
    const closeBtn = document.querySelector(".close");
    const form = document.getElementById("appForm");
    const cards = document.querySelectorAll(".card");


    if(addBtn){
        addBtn.addEventListener("click", function(){
            modal.style.display = "flex";
        });
    }


    if(closeBtn){
        closeBtn.addEventListener("click", function(){
            modal.style.display = "none";
        });
    }

    window.addEventListener("click", function(e){
        if(e.target === modal){
            modal.style.display = "none";
        }
    });


    if(form){
        form.addEventListener("submit", function(e){

            e.preventDefault();

            alert("Application Added Successfully 🎉");

            modal.style.display = "none";

            form.reset();

        });
    }

    cards.forEach(card => {

        card.addEventListener("mouseenter", () => {
            card.style.boxShadow = "0 10px 25px rgba(0,0,0,0.4)";
        });

        card.addEventListener("mouseleave", () => {
            card.style.boxShadow = "none";
        });

    });

});


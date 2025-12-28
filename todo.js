document.querySelectorAll(".cont").forEach(cont => {
    const activity = cont.querySelector(".ACTIVITY");
    const time = cont.querySelectorAll(".inside");

    activity.addEventListener("blur", () => savePlanner(cont));

    time.forEach(input => {
        input.addEventListener("change", () => savePlanner(cont));
    });
});

function savePlanner(cont) {
    const day = cont.dataset.day;
    const activity = cont.querySelector(".ACTIVITY").value;
    const fromtime = cont.querySelectorAll(".inside")[0].value;
    const totime = cont.querySelectorAll(".inside")[1].value;

    if (!activity || !fromtime || !totime) return;

    fetch("http://localhost:8080/auth/saveplanner", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            day,
            activity,
            fromtime,
            totime
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Saved:", data);
    })
    .catch(err => console.error(err));
}

window.onload = () => {
    fetch("http://localhost:8080/auth/getplanner")
        .then(res => res.json())
        .then(result => {
            result.data.forEach(item => {
                const cont = document.querySelector(
                    `.cont[data-day="${item.day}"]`
                );
                if (!cont) return;

                cont.querySelector(".ACTIVITY").value = item.activity;
                cont.querySelectorAll(".inside")[0].value = item.fromtime;
                cont.querySelectorAll(".inside")[1].value = item.totime;
            });
        })
        .catch(err => console.error(err));
};
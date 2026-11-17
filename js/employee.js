
const STORAGE_KEY = "empeo_employee_assessment";

const criteria = ["quality", "ownership", "collaboration"];

const fields = [
    "quality-evidence",
    "ownership-evidence",
    "collaboration-evidence",
    "achievements",
    "challenges"
];

const getAssessment = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
};

const saveAssessment = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

function collectFormData() {
    const data = {};

    criteria.forEach((criterion) => {
        const selected = document.querySelector(
            `input[name="${criterion}"]:checked`
        );

        data[criterion] = selected ? selected.value : "";
    });

    fields.forEach((id) => {
        data[id] = document.getElementById(id).value;
    });

    data.status = getAssessment().status || "draft";

    return data;
}

function restoreFormData() {
    const data = getAssessment();

    criteria.forEach((criterion) => {
        if (!data[criterion]) return;

        const input = document.querySelector(
            `input[name="${criterion}"][value="${data[criterion]}"]`
        );

        if (input) input.checked = true;
    });

    fields.forEach((id) => {
        const element = document.getElementById(id);

        if (element && data[id]) {
            element.value = data[id];
        }
    });

    if (data.status === "submitted") {
        updateSubmittedState();
    }

    updateProgress();
}

function updateProgress() {
    const completed = criteria.filter((criterion) => {
        return document.querySelector(
            `input[name="${criterion}"]:checked`
        );
    }).length;

    const percentage = (completed / criteria.length) * 100;

    document.getElementById("progress-fill").style.width =
        `${percentage}%`;

    document.getElementById("completion-text").textContent =
        `${completed} of ${criteria.length} completed`;
}

function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    window.clearTimeout(showToast.timeout);

    showToast.timeout = window.setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function saveDraft() {
    const data = collectFormData();
    data.status = "draft";

    saveAssessment(data);

    document.getElementById("save-message").textContent =
        "Draft saved successfully.";

    showToast("Your assessment draft has been saved.");
}

function submitAssessment() {
    const incomplete = criteria.filter((criterion) => {
        return !document.querySelector(
            `input[name="${criterion}"]:checked`
        );
    });

    if (incomplete.length > 0) {
        showToast("Please rate all three evaluation criteria.");
        return;
    }

    const confirmed = window.confirm(
        "Are you sure you want to submit your self-assessment? You will not be able to edit it in this demo."
    );

    if (!confirmed) return;

    const data = collectFormData();
    data.status = "submitted";
    data.submittedAt = new Date().toISOString();

    saveAssessment(data);
    updateSubmittedState();

    showToast("Your self-assessment has been submitted.");
}

function updateSubmittedState() {
    const status = document.getElementById("review-status");
    const submitButton = document.getElementById("submit-button");

    status.textContent = "Submitted";
    status.classList.remove("status-pending");
    status.classList.add("status-locked");

    submitButton.textContent = "Assessment submitted";
    submitButton.disabled = true;
    submitButton.style.opacity = "0.65";
    submitButton.style.cursor = "not-allowed";

    document.getElementById("save-message").textContent =
        "Your self-assessment has been submitted.";
}

// Event listeners
document.querySelectorAll(".rating-options input").forEach((input) => {
    input.addEventListener("change", updateProgress);
});

document.getElementById("save-button").addEventListener(
    "click",
    saveDraft
);

document.getElementById("submit-button").addEventListener(
    "click",
    submitAssessment
);

// Restore any previously saved demo data
restoreFormData();

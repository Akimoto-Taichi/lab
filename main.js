const SUPABASE_URL = "https://fmfonzrtejxvpfjchvfs.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_eJX4Dp3CMUHmATSE-dUrLw_nbze3Hgg";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const authDiv = document.getElementById("auth");
const appDiv = document.getElementById("app");
const userEmail = document.getElementById("user-email");

supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    authDiv.style.display = "none";
    appDiv.style.display = "block";
    userEmail.textContent = session.user.email;
    loadCards();
  } else {
    authDiv.style.display = "block";
    appDiv.style.display = "none";
  }
});

async function signUp() {
  const email = emailInput();
  const password = passwordInput();

  if (!email.endsWith("@edu.nishiyamato.ed.jp")) {
    alert("学校メールのみ");
    return;
  }

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
}

async function signIn() {
  const email = emailInput();
  const password = passwordInput();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
}

async function logout() {
  await supabase.auth.signOut();
}

async function addCard() {
  const q = document.getElementById("question").value;
  const a = document.getElementById("answer").value;

  await supabase.from("cards").insert({ question: q, answer: a });
  loadCards();
}

async function loadCards() {
  const { data } = await supabase
    .from("cards")
    .select("question, answer");

  const list = document.getElementById("card-list");
  list.innerHTML = "";
  data.forEach(c => {
    const li = document.createElement("li");
    li.textContent = `${c.question} → ${c.answer}`;
    list.appendChild(li);
  });
}

function emailInput() {
  return document.getElementById("email").value;
}
function passwordInput() {
  return document.getElementById("password").value;
}


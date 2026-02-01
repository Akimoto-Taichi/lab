// ===== Supabase 初期化（1回だけ）=====
const SUPABASE_URL = "https://fmfonzrtejxvpfjchvfs.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_eJX4Dp3CMUHmATSE-dUrLw_nbze3Hgg";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ===== DOM取得（重要）=====
const authDiv = document.getElementById("auth");
const appDiv = document.getElementById("app");
const userEmail = document.getElementById("user-email");

// ===== 認証状態で画面切替 =====
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

// ===== 新規登録 =====
async function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email.endsWith("@edu.nishiyamato.ed.jp")) {
    alert("学校メールのみ利用できます");
    return;
  }

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
}

// ===== ログイン =====
async function signIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) alert(error.message);
}

// ===== ログアウト =====
async function logout() {
  await supabase.auth.signOut();
}

// ===== カード追加 =====
async function addCard() {
  const question = document.getElementById("question").value;
  const answer = document.getElementById("answer").value;

  await supabase.from("cards").insert({
    question,
    answer
  });

  loadCards();
}

// ===== カード取得 =====
async function loadCards() {
  const { data } = await supabase
    .from("cards")
    .select("*")
    .order("created_at", { ascending: false });

  const list = document.getElementById("card-list");
  list.innerHTML = "";

  data.forEach(card => {
    const li = document.createElement("li");
    li.textContent = `${card.question} → ${card.answer}`;
    list.appendChild(li);
  });
}


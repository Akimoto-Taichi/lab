// ★自分の値に置き換え
const SUPABASE_URL = "https://fmfonzrtejxvpfjchvfs.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_eJX4Dp3CMUHmATSE-dUrLw_nbze3Hgg";
const SCHOOL_DOMAIN = "@edu.nishiyamato.ed.jp";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM
const authDiv = document.getElementById("auth");
const appDiv = document.getElementById("app");
const status = document.getElementById("status");
const cardsDiv = document.getElementById("cards");

const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const isPublicEl = document.getElementById("is_public");

// 画面切替
function updateView(session) {
  if (session) {
    authDiv.style.display = "none";
    appDiv.style.display = "block";
    loadCards();
  } else {
    authDiv.style.display = "block";
    appDiv.style.display = "none";
  }
}

// 新規登録
async function signUp() {
  const email = emailEl.value.trim();
  const password = passwordEl.value;

  if (!email.endsWith(SCHOOL_DOMAIN)) {
    status.textContent = "学校メールのみ使用できます";
    return;
  }

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) status.textContent = error.message;
  else updateView(data.session);
}

// ログイン
async function signIn() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailEl.value.trim(),
    password: passwordEl.value
  });
  if (error) status.textContent = error.message;
  else updateView(data.session);
}

// ログアウト
async function signOut() {
  await supabase.auth.signOut();
  updateView(null);
}

// 追加
async function addCard() {
  const session = (await supabase.auth.getSession()).data.session;
  if (!session) return;

  const { error } = await supabase.from("cards").insert({
    user_id: session.user.id,
    question: questionEl.value,
    answer: answerEl.value,
    is_public: isPublicEl.checked
  });

  if (error) {
    alert(error.message);
    return;
  }
  questionEl.value = "";
  answerEl.value = "";
  isPublicEl.checked = false;
  loadCards();
}

// 削除
async function deleteCard(id) {
  const { error } = await supabase.from("cards").delete().eq("id", id);
  if (error) alert(error.message);
  loadCards();
}

// 表示（RLSにより「自分＋公開のみ」返る）
async function loadCards() {
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    cardsDiv.textContent = error.message;
    return;
  }

  cardsDiv.innerHTML = "";
  data.forEach(c => {
    const d = document.createElement("div");
    d.className = "card";
    d.innerHTML = `
      <b>Q.</b> ${c.question}<br>
      <b>A.</b> ${c.answer}<br>
      <small>${c.is_public ? "公開" : "非公開"}</small><br>
      ${c.user_id ? `<button onclick="deleteCard('${c.id}')">削除</button>` : ""}
    `;
    cardsDiv.appendChild(d);
  });
}

// 初期判定
supabase.auth.getSession().then(r => updateView(r.data.session));
supabase.auth.onAuthStateChange((_e, s) => updateView(s));


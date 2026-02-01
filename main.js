import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ★ 自分の Supabase 情報に置き換え
const SUPABASE_URL = "https://fmfonzrtejxvpfjchvfs.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_eJX4Dp3CMUHmATSE-dUrLw_nbze3Hgg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const SCHOOL_DOMAIN = "@edu.nishiyamato.ed.jp";

// DOM
const authDiv = document.getElementById("auth");
const appDiv = document.getElementById("app");
const msg = document.getElementById("message");
const userEmail = document.getElementById("userEmail");

// 学校ドメインチェック
function isSchoolEmail(email) {
  return email.endsWith(SCHOOL_DOMAIN);
}

// 新規登録
window.signUp = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!isSchoolEmail(email)) {
    msg.textContent = "学校のメールアドレスのみ使用できます";
    return;
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  msg.textContent = error ? error.message : "登録完了！ログインしてください";
};

// ログイン
window.signIn = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!isSchoolEmail(email)) {
    msg.textContent = "学校のメールアドレスのみ使用できます";
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  msg.textContent = error ? error.message : "";
};

// ログアウト
window.logout = async () => {
  await supabase.auth.signOut();
};

// ログイン状態監視
supabase.auth.onAuthStateChange((_event, session) => {
  if (session) {
    authDiv.style.display = "none";
    appDiv.style.display = "block";
    userEmail.textContent = "ログイン中: " + session.user.email;
  } else {
    authDiv.style.display = "block";
    appDiv.style.display = "none";
  }
});

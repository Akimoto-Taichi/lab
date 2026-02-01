const SUPABASE_URL = "https://fmfonzrtejxvpfjchvfs.supabase.co"
const SUPABASE_ANON_KEY = "
sb_publishable_eJX4Dp3CMUHmATSE-dUrLw_nbze3Hgg"

const supabase = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)

let user = null
const status = document.getElementById("status")

async function signUp() {
  const email = emailValue()
  const password = passwordValue()
  const { error } = await supabase.auth.signUp({ email, password })
  status.textContent = error ? error.message : "登録完了。ログインしてください"
}

async function login() {
  const email = emailValue()
  const password = passwordValue()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) status.textContent = error.message
  else {
    user = data.user
    status.textContent = "ログイン中：" + user.email
  }
}

async function addCard() {
  if (!user) return alert("ログインしてください")
  await supabase.from("cards").insert({
    front: document.getElementById("front").value,
    back: document.getElementById("back").value,
    is_public: document.getElementById("isPublic").checked,
    user_id: user.id
  })
  alert("保存しました")
}

async function loadPublic() {
  const ul = document.getElementById("cards")
  ul.innerHTML = ""
  const { data } = await supabase
    .from("cards")
    .select("front, back")
    .eq("is_public", true)
  data.forEach(c => {
    const li = document.createElement("li")
    li.textContent = `${c.front} → ${c.back}`
    ul.appendChild(li)
  })
}

function emailValue() {
  return document.getElementById("email").value
}
function passwordValue() {
  return document.getElementById("password").value
}

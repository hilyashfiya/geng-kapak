import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. OPENING
html = html.replace('est. 2022 · 5 girls · countless memories', 'est. 2023 · 5 girls · countless memories')
html = html.replace('est. 2022 — archive', 'est. 2023 — archive')

# 2. THE FIVE OF US
html = html.replace('<p class="section-tag fade-in-up">lima orang</p>', '<p class="section-tag fade-in-up">empat orang</p>')
html = re.sub(
    r'<div class="member-detail-card fade-in-up delay-1">\s*<div class="mdc-img" style="--accent:#C4919A;">🌸</div>\s*<h3 class="mdc-name">Hilya</h3>.*?</div>',
    '',
    html,
    flags=re.DOTALL
)
html = re.sub(
    r'<h3 class="mdc-name">Uwa</h3>.*?</div>',
    '<h3 class="mdc-name">Uwa</h3>\n          <p class="mdc-desc">orang yang aku kenal waktu aku belum punya banyak teman di kampus. uwa salah satu orang pertama yang bikin masa awal kuliah aku terasa lumayan lebih gampang buat dijalanin.</p>\n        </div>',
    html,
    flags=re.DOTALL
)
html = re.sub(
    r'<h3 class="mdc-name">Salwa</h3>.*?</div>',
    '<h3 class="mdc-name">Umi</h3>\n          <p class="mdc-desc">orang yang pernah ngingetin aku kalau ternyata masih banyak yang sayang sama aku, justru di saat aku sendiri lagi susah banget buat percaya soal itu.</p>\n        </div>',
    html,
    flags=re.DOTALL
)
html = re.sub(
    r'<h3 class="mdc-name">Tyan</h3>.*?</div>',
    '<h3 class="mdc-name">Tyan</h3>\n          <p class="mdc-desc">orang yang sering banget tetap berusaha ngebantu dan hadir buat aku, padahal kadang dia sendiri juga lagi nggak baik-baik aja.</p>\n        </div>',
    html,
    flags=re.DOTALL
)
html = re.sub(
    r'<h3 class="mdc-name">Nass</h3>.*?</div>',
    '<h3 class="mdc-name">Nass</h3>\n          <p class="mdc-desc">orang yang selalu sedia ngasih ruang tiap kali aku butuh tempat buat cerita, dan dengerin semuanya tanpa nge-judge.</p>\n        </div>',
    html,
    flags=re.DOTALL
)

# 3. ARCHIVE
html = html.replace(
    '<div class="archive-label">perempuan random<br />yang entah gimana cocok</div>',
    '<div class="archive-label">perempuan random<br />yang entah gimana nyambung</div>'
)
html = html.replace(
    '<div class="archive-label">topik obrolan<br />yang nggak ada habisnya</div>',
    '<div class="archive-label">foto aib di galeri hilya<br />(terutama komuk nazwa)</div>'
)
html = html.replace(
    '<div class="archive-label">kapak sebagai simbol<br />geng yang solid</div>',
    '<div class="archive-label">nama random dari deffran<br />yang ujung-ujungnya dipakai terus</div>'
)
html = html.replace(
    '<div class="archive-label">drama yang benar-benar<br />merusak segalanya</div>',
    '<div class="archive-label">kemampuan ngikutin trend tiktok<br />dengan normal</div>'
)
html = html.replace(
    '<div class="archive-label">kemungkinan kita<br />masih ngobrol 10 tahun lagi</div>',
    '<div class="archive-label">kemungkinan wacana main<br />batal karena pada mager</div>'
)

# 4. HOW IT STARTED
how_it_started_html = """      <div class="story-block">
        <div class="story-text">
          <p class="fade-in-left">
            awalnya kita cuma ketemu dan kenalan biasa pas awal kuliah tahun 2023. lalu karena sering bareng, akhirnya bikin grup whatsapp.
          </p>
          <p class="fade-in-left delay-1">
            kita nggak pernah ngerencanain buat bikin “geng” atau semacamnya. tapi tiba-tiba deffran ngasih julukan “geng kapak” ke kita.
          </p>
          <p class="fade-in-left delay-2">
            <span class="script-text">nama yang super random itu entah gimana malah nempel dan akhirnya dipakai terus sampai sekarang wkwk.</span>
          </p>
          
          <div class="story-timeline fade-in-up delay-3">
            <div class="st-item">
              <span class="st-dot"></span>
              <p class="st-text">ketemu dan mulai kenalan bareng.</p>
            </div>
            <div class="st-item">
              <span class="st-dot"></span>
              <p class="st-text">bikin grup whatsapp.</p>
            </div>
            <div class="st-item">
              <span class="st-dot"></span>
              <p class="st-text">dikasih julukan "geng kapak" sama deffran.</p>
            </div>
            <div class="st-item">
              <span class="st-dot"></span>
              <p class="st-text">keterusan pakai nama itu sampai sekarang.</p>
            </div>
          </div>
        </div>
        <div class="story-image-wrap fade-in-right delay-1">
          <div class="story-polaroid">
            <div class="story-polaroid-img">🪓✨</div>
            <p class="story-polaroid-caption">awal dari segalanya</p>
          </div>
        </div>
      </div>"""
html = re.sub(r'<div class="story-block">.*?</div>\s*</div>\s*</div>', how_it_started_html + '\n    </div>', html, flags=re.DOTALL)

# 5. MEMORIES GALLERY SUBTITLE
html = html.replace('Nggak semua difoto. Nggak semua dipost. Tapi semua disimpan — entah di memori HP, entah di kepala.', 'nggak semua difoto. nggak semua dipost. tapi semua disimpan — entah di memori hp, entah di kepala.')

# 6. MEMORY MOMENTS
moments_html = """      <div class="moments-grid">
        <div class="moment-card fade-in-up delay-1" style="--accent:#C4919A;">
          <div class="moment-emoji">🌆</div>
          <h3 class="moment-title">braga trip (11 april 2025)</h3>
          <p class="moment-text">jarang banget kita beneran pergi berlima cuma buat main di luar kampus. makanya pas akhirnya bisa ke braga, momennya berkesan banget.</p>
        </div>
        <div class="moment-card fade-in-up delay-2" style="--accent:#C97B4B;">
          <div class="moment-emoji">🚶‍♀️</div>
          <h3 class="moment-title">gerlong</h3>
          <p class="moment-text">awalnya cuma "otw gerlong" sambil nunggu kelas. ujungnya mendaki bukit, kecapekan, tapi tetep aja dilakuin lagi lain waktu.</p>
        </div>
        <div class="moment-card fade-in-up delay-3" style="--accent:#8A9E7E;">
          <div class="moment-emoji">🎬</div>
          <h3 class="moment-title">cinema + kosan nass (19 des 2023)</h3>
          <p class="moment-text">salah satu momen kumpul bareng, nonton, terus lanjut nge-basecamp di kosan nazwa.</p>
        </div>
        <div class="moment-card fade-in-up delay-2" style="--accent:#D4B483;">
          <div class="moment-emoji">🎤</div>
          <h3 class="moment-title">p2m (15 jan 2025)</h3>
          <p class="moment-text">walau beda divisi dan sibuk sendiri-sendiri, seneng banget tetep bisa nyempetin punya momen bareng di tengah proker.</p>
        </div>
        <div class="moment-card fade-in-up delay-3" style="--accent:#C4919A;">
          <div class="moment-emoji">🎂</div>
          <h3 class="moment-title">birthday surprise</h3>
          <p class="moment-text">tiap ada yang ultah, pasti repot bikin planning group dadakan buat nentuin hadiah atau konsep surprise.</p>
        </div>
      </div>"""
html = re.sub(r'<div class="moments-grid">.*?</div>\s*</div>\s*</section>', moments_html + '\n    </div>\n  </section>', html, flags=re.DOTALL)

# 7. CHAOS
html = html.replace('🌀 Chaos Mode', '🌀 chaos mode')
html = html.replace('Kita Memang Begini', 'kita memang begini')
html = html.replace('Janjian jam 10, semua siap jam 12. Niat makan sehat, ujungnya sambel level 4. Plan A gagal, plan B nggak pernah ada.', 'janjian main, akhirnya wacana karena mager. udah spin makanan, ujungnya tetep mencar beli sendiri-sendiri. mau nugas di rumah uwa, malah ngeghibah.')
html = html.replace('"Kita ini kacau, tapi kacau yang nyaman banget buat ditinggali." 🪓', '"mau dresscode aja selalu ada anomali. tebak siapa? nazwa lagi." 🪓')

# 8. LITTLE THINGS
little_things_html = """      <div class="little-grid">
        <div class="little-item fade-in-up delay-1"><div class="li-emoji">📸</div><p class="li-text">galeri hilya penuh aib (nazwa selalu komuk)</p></div>
        <div class="little-item fade-in-up delay-2"><div class="li-emoji">🎡</div><p class="li-text">udah di-spin, tetep aja belinya mencar</p></div>
        <div class="little-item fade-in-up delay-3"><div class="li-emoji">👗</div><p class="li-text">dresscode ada anomali (nazwa lagi)</p></div>
        <div class="little-item fade-in-up delay-1"><div class="li-emoji">💃</div><p class="li-text">trend tiktok sekaku sarwendah</p></div>
        <div class="little-item fade-in-up delay-2"><div class="li-emoji">🚶‍♀️</div><p class="li-text">nunggu kelas otw gerlong (berujung kecapekan)</p></div>
        <div class="little-item fade-in-up delay-3"><div class="li-emoji">📚</div><p class="li-text">nugas di garnadi atau selasar fpips</p></div>
        <div class="little-item fade-in-up delay-1"><div class="li-emoji">👥</div><p class="li-text">susah banget bisa lengkap berlima</p></div>
        <div class="little-item fade-in-up delay-2"><div class="li-emoji">🏠</div><p class="li-text">kosan nazwa jadi basecamp</p></div>
        <div class="little-item fade-in-up delay-3"><div class="li-emoji">🍟</div><p class="li-text">cimol dan kentang</p></div>
      </div>"""
html = re.sub(r'<div class="little-grid">.*?</div>\s*</div>\s*</section>', little_things_html + '\n    </div>\n  </section>', html, flags=re.DOTALL)

# 9. OUT OF CONTEXT
ooc_html = """      <div class="ooc-grid">
        <div class="ooc-card fade-in-up delay-1">
          <p class="ooc-text">"otw gerlong."</p>
          <p class="ooc-sub">(berujung kecapekan mendaki bukit)</p>
        </div>
        <div class="ooc-card fade-in-up delay-2">
          <p class="ooc-text">"spin dulu."</p>
          <p class="ooc-sub">(tapi akhirnya tetep mencar beli makanan masing-masing)</p>
        </div>
        <div class="ooc-card fade-in-up delay-3">
          <p class="ooc-text">"nugas yuk."</p>
          <p class="ooc-sub">(di rumah uwa yang berujung ngeghibah)</p>
        </div>
        <div class="ooc-card fade-in-up delay-1">
          <p class="ooc-text">"nazwa lagi."</p>
          <p class="ooc-sub">(kalau ada anomali dresscode atau komuk di foto)</p>
        </div>
        <div class="ooc-card fade-in-up delay-2">
          <p class="ooc-text">"akhirnya mencar juga."</p>
          <p class="ooc-sub">(setelah debat panjang mau makan apa)</p>
        </div>
        <div class="ooc-card fade-in-up delay-3">
          <p class="ooc-text">"cimol atau kentang?"</p>
          <p class="ooc-sub">(pertanyaan wajib)</p>
        </div>
      </div>"""
html = re.sub(r'<div class="ooc-grid">.*?</div>\s*</div>\s*</section>', ooc_html + '\n    </div>\n  </section>', html, flags=re.DOTALL)

# 10. REFLECTION
reflection_html = """        <p class="section-tag fade-in-up" style="color:var(--accent-gold);">refleksi</p>
        <p class="reflection-text fade-in-up delay-1">
          dulu aku beneran nggak percaya kalau aku bakal nemuin teman yang tulus selama perkuliahan.
        </p>
        <p class="reflection-sub fade-in-up delay-2">
          aku datang ke kuliah dengan ekspektasi yang rendah banget soal pertemanan.
        </p>
        <p class="reflection-sub fade-in-up delay-3">
          tapi kalian bikin aku sadar kalau ternyata aku salah. pelan-pelan, kalian bikin aku percaya kalau pertemanan yang tulus itu ternyata masih ada.
        </p>
        <p class="reflection-sub fade-in-up delay-4" style="margin-top: 2rem; font-style: italic;">
          makasih ya udah jadi alasan kenapa masa kuliah ini terasa lebih baik.
        </p>"""
html = re.sub(r'<p class="section-tag fade-in-up" style="color:var(--accent-gold);">refleksi</p>.*?</div>\s*</div>\s*</section>', reflection_html + '\n      </div>\n    </div>\n  </section>', html, flags=re.DOTALL)

# 11. FUTURE
future_html = """      <p class="section-tag fade-in-up">🌅 yang kita takutkan</p>
      <h2 class="section-title fade-in-up delay-1">bukan perpisahan<br /><em>tapi perubahan</em></h2>
      <div class="section-divider fade-in-up delay-2"></div>
      <div class="future-grid">
        <div class="future-card fade-in-up delay-1" style="--color:#C4919A;">
          <div class="future-icon">🕒</div>
          <h3 class="future-title">makin susah kumpul</h3>
          <p class="future-text">semester makin akhir. proposal mulai nyita waktu. magang bakal bawa kita ke tempat yang beda-beda. ngumpulin lima orang bakal jauh lebih susah lagi.</p>
        </div>
        <div class="future-card fade-in-up delay-2" style="--color:#C97B4B;">
          <div class="future-icon">💬</div>
          <h3 class="future-title">grup mulai sepi</h3>
          <p class="future-text">grup mungkin nggak seramai dulu. bukan berarti kita nggak sayang, cuma hidup masing-masing emang mulai kerasa lebih sibuk.</p>
        </div>
        <div class="future-card fade-in-up delay-3" style="--color:#8A9E7E;">
          <div class="future-icon">🌿</div>
          <h3 class="future-title">tempat yang bakal dirindukan</h3>
          <p class="future-text">mungkin kita nggak bakal sesering dulu nugas di selasar fpips, nongkrong di garnadi, mendaki ke gerlong, atau nge-basecamp di kosan nazwa.</p>
        </div>
        <div class="future-card fade-in-up delay-2" style="--color:#D4B483;">
          <div class="future-icon">🕸️</div>
          <h3 class="future-title">berubah, bukan berakhir</h3>
          <p class="future-text">mungkin yang paling kita takutkan bukan kehilangan satu sama lain, tapi kehilangan kesempatan buat balik jadi kayak dulu.</p>
        </div>
      </div>
      <p class="chaos-quote fade-in-up" style="color: var(--text-muted); font-size: 1.1rem; margin-top: 4rem;">
        “kalau nanti waktu bikin kita nggak sesering dulu bersama,<br />semoga waktu nggak pernah bikin kita jadi asing.”
      </p>"""
html = re.sub(r'<p class="section-tag fade-in-up">🌅 yang kita takutkan</p>.*?</div>\s*</section>', future_html + '\n    </div>\n  </section>', html, flags=re.DOTALL)

# 12. MAIN QUOTE
main_quote_html = """      <p class="main-quote-text fade-in-up">
        “bukan tentang seberapa sering kita bakal terus bareng nanti,<br /><br />
        tapi tentang fakta kalau kita pernah tumbuh bareng<br />di satu fase hidup yang sama.”
      </p>
      <p class="main-quote-author fade-in-up delay-2">— hilya 🪓</p>"""
html = re.sub(r'<p class="main-quote-text fade-in-up">.*?</div>\s*</section>', main_quote_html + '\n    </div>\n  </section>', html, flags=re.DOTALL)


# 13. FINAL GROUP MESSAGE
fgm_html = """        <h2 class="fgm-title fade-in-up">"sebelum semuanya berubah,<br />aku cuma pengen nyimpen versi kita yang kayak gini di sini."</h2>
        <div class="fgm-body fade-in-up delay-1">
          <p>ini bukan tentang perpisahan. ini cuma buat pengingat.</p>
          <p>pengingat kalau kita pernah nugas bareng di garnadi, pernah capek-capek otw gerlong, pernah bingung mau makan apa sampai harus spin walau ujungnya mencar juga, dan pernah nyimpen banyak foto aib.</p>
          <p>susah banget buat lengkap berlima, tapi pas akhirnya bisa ngumpul, rasanya selalu seru.</p>
          <p>aku harap rasa sayang ini tetep ada ya. dengan cara apapun, walau nanti kita udah beda tempat.</p>
        </div>"""
html = re.sub(r'<h2 class="fgm-title fade-in-up">.*?</div>\s*</div>\s*</div>\s*</section>', fgm_html + '\n      </div>\n    </div>\n  </section>', html, flags=re.DOTALL)

# 14. FINAL SCREEN
html = html.replace('kalau suatu hari nanti kita nggak lagi punya banyak waktu untuk satu sama lain,<br />\n        aku harap kita nggak pernah kekurangan alasan untuk tetap saling menyayangi.', 'kalau suatu hari nanti kita nggak punya banyak waktu buat kumpul,<br />\n        aku harap kita nggak pernah kehabisan alasan buat tetep saling sayang.')
html = html.replace('dengan sepenuh hati,<br />Hilya 🖤🪓', 'dengan sepenuh hati,<br />hilya 🖤🪓')


with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Update complete")

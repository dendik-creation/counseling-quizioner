<?php

namespace Database\Seeders;

use App\Models\Questionnaire;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuizNQuestionSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Questionnaire
        $questionnaire = Questionnaire::create([
            "title" => "GUSJIGANG",
            "description" => "Sebuah kuis mengenai sebuah konselinng",
            "access_token" => "GUSJIG",
            "expires_at" => now()->addDays(1),
        ]);

        // Choices
        $choices = [
            [
                "questionnaire_id" => $questionnaire->id,
                "choice" => "Selalu",
                "point" => 5,
                "created_at" => now(),
                "updated_at" => now(),
            ],
            [
                "questionnaire_id" => $questionnaire->id,
                "choice" => "Sering",
                "point" => 4,
                "created_at" => now(),
                "updated_at" => now(),
            ],
            [
                "questionnaire_id" => $questionnaire->id,
                "choice" => "Kadang",
                "point" => 3,
                "created_at" => now(),
                "updated_at" => now(),
            ],
            [
                "questionnaire_id" => $questionnaire->id,
                "choice" => "Jarang",
                "point" => 2,
                "created_at" => now(),
                "updated_at" => now(),
            ],
            [
                "questionnaire_id" => $questionnaire->id,
                "choice" => "Tidak Pernah",
                "point" => 1,
                "created_at" => now(),
                "updated_at" => now(),
            ],
        ];

        // Questions
        $questions = [
            "Saya mempertimbangkan perasaan orang lain sebelum berbicara",
            "Saya menggunakan nalar sehat dalam menghadapi masalah.",
            "Saya mencari solusi yang adil bagi semua pihak.",
            "Saya bertindak terburu-buru (grusa-grusu) tanpa berpikir panjang.",
            "Saya siap membantu teman yang membutuhkan bantuan.",
            "Saya berperilaku sopan kepada siapa pun tanpa memandang status",
            "Saya mengabaikan tanggung jawab yang sudah diberikan",
            "Saya mengabaikan tanggung jawab yang sudah diberikan.",
            "Saya bangga dengan identitas diri saya sebagai makluk ciptaan Tuhan.",
            "Saya berperilaku sesuai dengan fitrah jenis kelamin saya",
            "Saya percaya diri menunjukkan kelebihan yang saya miliki",
            "Saya merasa minder dengan latar belakang keluarga saya",
            "Saya memegang teguh nilai-nilai agama dalam kehidupan sehari-hari.",
            "Saya mampu membedakan hal baik dan buruk berdasarkan norma",
            "Saya konsisten antara perkataan dan perbuatan.",
            "Saya mudah goyah oleh pengaruh buruk lingkungan.",
            "Saya menghargai perbedaan keyakinan di lingkungan saya",
            "Saya menjalin pertemanan dengan teman dari berbagai etnis",
            "Saya bersikap rukun dengan tetangga sekitar rumah.",
            "Saya cenderung menjauhi orang yang berbeda pendapat dengan saya.",
            "Saya senang terlibat dalam kegiatan kerja bakti di sekolah/Masyarakat",
            "Saya mengutamakan kepentingan bersama di atas kepentingan pribadi.",
            "Saya menjaga hubungan silaturahmi dengan teman lama.",
            "Saya hanya mau membantu jika mendapatkan imbalan materi",
            "Saya mampu menyesuaikan gaya bicara saya pada situasi formal",
            "Saya mendengarkan pendapat orang lain dengan penuh perhatian",
            "Saya berbicara dengan jujur agar orang lain percaya.",
            "Saya sering memotong pembicaraan orang lain",
            "Saya memberikan contoh perilaku yang baik bagi teman-teman",
            "Saya berani membela kebenaran meskipun sulit",
            "Saya bersedia mengakui kesalahan secara jujur",
            "Saya mengajak teman untuk melakukan hal-hal positif",
            "Saya membiarkan teman saya melakukan pelanggaran norma.",
            "Saya merasa gembira saat mendapatkan ilmu pengetahuan baru",
            "Saya memiliki rasa ingin tahu yang tinggi terhadap materi Pelajaran",
            "Saya menghargai setiap kesempatan belajar yang ada.",
            "Saya merasa bosan saat mengikuti kegiatan pembelajaran.",
            "Saya berusaha memahami makna di balik setiap teori yang dipelajari",
            "Saya mampu menghubungkan pelajaran dengan kehidupan nyata",
            "Saya melakukan refleksi diri terhadap hasil belajar saya.",
            "Saya belajar hanya untuk menghafal tanpa memahami isi pelajaran.",
            "Saya aktif berdiskusi di kelas untuk memperdalam pemahaman",
            "Saya memanfaatkan hasil belajar sebagai bahan evaluasi diri.",
            "Saya mengerjakan tugas sekolah tepat pada waktunya.",
            "Saya menunda-nunda pekerjaan yang menjadi tanggung jawab saya.",
            "Saya memiliki tujuan yang jelas dalam setiap proses belajar",
            "Saya yakin bahwa ilmu akan mengangkat derajat hidup saya",
            "Saya belajar dengan niat untuk ibadah kepada Tuhan.",
            "Saya sekolah hanya karena mengikuti keinginan orang tua saja.",
            "Saya memiliki jadwal belajar yang teratur setiap hari.",
            "Saya menggunakan berbagai sumber literasi untuk belajar",
            "Saya memiliki teknik mencatat yang memudahkan pemahaman.",
            "Saya belajar hanya ketika akan menghadapi ujian saja.",
            "Saya terus mencoba kembali saat gagal memahami suatu materi.",
            "Saya tekun mengikuti pengajian atau pelatihan tambahan.",
            "Saya fokus pada proses belajar untuk mencapai hasil maksimal",
            "Saya mudah menyerah jika menghadapi pelajaran yang sulit.",
            "Saya mengerjakan ujian dengan jujur tanpa mencontek",
            "Saya mengakui sumber referensi dalam setiap tugas saya.",
            "Saya bersedia membagikan ilmu yang saya miliki kepada teman.",
            "Saya menyuruh orang lain mengerjakan tugas sekolah saya",
            "Saya menyempatkan waktu khusus untuk menelaah buku Pelajaran",
            "Saya menghormati guru sebagai sumber ilmu pengetahuan",
            "Saya mengamalkan ilmu yang saya dapatkan dalam tindakan nyata",
            "Saya aktif mencari informasi mengenai perkembangan ilmu terbaru.",
            "Saya menganggap belajar sebagai beban yang memberatkan.",
            "Saya mengidentifikasi potensi diri yang mendukung karir saya",
            "Saya mengetahui keterampilan teknis yang saya kuasai",
            "Saya mengevaluasi minat pekerjaan yang cocok bagi saya.",
            "Saya tidak tahu bakat apa yang saya miliki untuk bekerja.",
            "Saya mengkaji secara mendalam peluang usaha di lingkungan saya.",
            "Saya memahami tantangan yang ada di dunia kerja saat ini.",
            "Saya mencari informasi mengenai profil pengusaha sukses.",
            "Saya merasa pesimis dapat bersaing di dunia kerja.",
            "Saya mendiskusikan rencana karir saya dengan orang tua",
            "Saya mempertimbangkan nasihat orang berpengaruh tentang bisnis",
            "Saya menyelaraskan harapan pribadi dengan kebutuhan pasar.",
            "Saya mengabaikan peluang usaha yang ada di sekitar saya.",
            "Saya memilih jurusan sekolah sesuai dengan rencana masa depan",
            "Saya menyiapkan mental untuk menghadapi resiko pekerjaan",
            "Saya yakin dengan pilihan karir yang telah saya tentukan.",
            "Saya sering berganti-ganti tujuan karir tanpa alasan jelas.",
            "Saya yakin pekerjaan yang saya pilih akan bermanfaat bagi sosial",
            "Saya optimis akan mendapatkan kepuasan dalam bekerja kelak.",
            "Saya merencanakan investasi dari hasil kerja saya nantinya.",
            "Saya hanya bekerja demi uang tanpa memikirkan keberkahan.",
            "Saya memiliki ide-ide baru untuk mengembangkan sebuah usaha",
            "Saya mampu menciptakan produk yang unik dan berbeda.",
            "Saya berani mengambil resiko logis dalam berbisnis",
            "Saya takut gagal sehingga tidak berani memulai usaha",
            "Saya mampu bekerja secara mandiri tanpa tergantung orang lain.",
            "Saya disiplin dalam mengelola waktu dan pekerjaan.",
            "Saya ulet dalam mencari solusi atas kendala usaha.",
            "Saya menghalalkan segala cara demi mendapatkan keuntungan.",
            "Saya menjalin jaringan pertemanan untuk mendukung karir.",
            "Saya mengedepankan kejujuran dalam setiap transaksi dagang.",
            "Saya menjaga kepercayaan pelanggan/atasan dengan baik.",
            "Saya bersyukur atas setiap rezeki yang saya peroleh.",
            "Saya mengingkari janji yang telah saya buat dalam berbisnis.",
        ];

        // insert questionnaire_id in each question
        $questions = array_map(
            fn($question) => [
                "questionnaire_id" => $questionnaire->id,
                "question" => $question,
                "created_at" => now(),
                "updated_at" => now(),
            ],
            $questions,
        );

        // Insert progress
        DB::table("choices")->insert($choices);
        DB::table("questions")->insert($questions);
    }
}

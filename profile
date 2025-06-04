<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>User Profile</title>

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

    <style>
        :root {
            --primary-color: #0288D1;
            --secondary-color: #00BCD4;
            --background-color: #0A192F;
            --card-color: #112F4E;
            --text-color: #E0F7FA;
            --muted-text: #80DEEA;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', sans-serif;
            margin: 0;
            background-color: var(--background-color);
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }

        .card {
            background-color: var(--card-color);
            width: 90%;
            max-width: 400px;
            border-radius: 20px;
            padding: 32px;
            text-align: center;
            animation: fadeInUp 0.6s ease-out forwards;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(40px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .profile-img {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid var(--secondary-color);
            margin-bottom: 24px;
        }

        input[type="text"], input[type="email"] {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid var(--secondary-color);
            border-radius: 10px;
            font-size: 18px;
            color: var(--text-color);
            background-color: #073353;
            margin-bottom: 16px;
        }

        .save-button {
            background-color: var(--primary-color);
            color: white;
            padding: 14px;
            border: none;
            border-radius: 28px;
            font-size: 18px;
            font-weight: 600;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            transition: background 0.2s ease;
        }

            .save-button:hover {
                background-color: #0277bd;
            }

        .footer {
            font-size: 12px;
            color: #aaa;
            margin-top: 24px;
        }
    </style>
</head>
<body>

    <header>
    <div id="hamburger" title="Back" tabindex="0" role="button">
        <span class="material-icons">arrow_back</span>
    </div>
    Vault
    </header>
    <main id="mainContent">
        <div class="card">
            <img src="https://placehold.co/120X120" alt="Profile Image" class="profile-img" />

            <form onsubmit="event.preventDefault(); saveProfile();">
                <input type="text" id="name" placeholder="Full Name" value="John Doe" />
                <input type="email" id="email" placeholder="Email" value="john.doe@example.com" />
                <input type="text" id="mobile" placeholder="Mobile Number" value="9876543210" maxlength="10" />

                <button class="save-button" type="submit">
                    <span>Save</span>
                    <i class="material-icons">save</i>
                </button>
            </form>

            <div class="footer">© 2025 SecureVault</div>
        </div>
    </main>
    <script>
        function saveProfile() {
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const mobile = document.getElementById("mobile").value.trim();

            if (!name || !email || !/^\d{10}$/.test(mobile)) {
                alert("Please fill out all fields correctly.");
                return;
            }

            alert(`✅ Profile saved for ${name}`);
        }
    </script>

</body>
</html>

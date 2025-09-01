# How to Fix Build Errors on Vercel

You are seeing a `FirebaseError: Firebase: Error (auth/invalid-api-key)` because your secret keys are not available during the build process on Vercel.

To fix this, you must add your environment variables to your Vercel project settings.

### Step 1: Go to Your Vercel Dashboard

1.  Open [Vercel](https://vercel.com/) and log in.
2.  Find your project in the dashboard and click on it.

### Step 2: Open Environment Variables Settings

1.  Click on the **Settings** tab.
2.  In the menu on the left, click on **Environment Variables**.

### Step 3: Add Your Secrets

You need to add each secret from your `.env` file as a new environment variable.

1.  For each variable below, copy the **Key** and paste it into the "Key" field in Vercel.
2.  Then, copy the corresponding **Value** from your local `.env` file and paste it into the "Value" field in Vercel.
3.  Click **Save**.

**You must add all of the following variables:**

| Key                                           | Value                                       |
| --------------------------------------------- | ------------------------------------------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`                | `AIzaSyBEacnAn7ZEDKNSr743vnKE2_RjeSubo_A`    |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`            | `rameens-c4ef9.firebaseapp.com`             |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`             | `rameens-c4ef9`                             |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`         | `rameens-c4ef9.appspot.com`                 |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`    | `856546450952`                              |
| `NEXT_PUBLIC_FIREBASE_APP_ID`                 | *Your value from the Firebase Console*      |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`         | *Your value from the Firebase Console*      |
| `GEMINI_API_KEY`                              | *Your Gemini API Key*                       |


**Important:** Make sure there are no extra spaces before or after the keys and values when you paste them.

### Step 4: Redeploy

After you have added all the environment variables, you need to trigger a new build.

1.  Go to the **Deployments** tab in your Vercel project.
2.  Find the most recent deployment that failed.
3.  Click the three-dots menu (`...`) on the right and select **Redeploy**.

This will start a new build with the correct secrets, and the error should be resolved.

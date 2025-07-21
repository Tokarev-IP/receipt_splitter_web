import React from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";

const ReceiptSplitterPrivacyPolicyPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          📜 Receipt Splitter — Privacy Policy
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          <strong>Effective Date:</strong> 17/07/2025
        </Typography>
        <Typography sx={{ mb: 2, display: 'block' }}>
          <strong>Receipt Splitter</strong> (“we”, “our”, “us”) provides this Privacy Policy to explain how we collect, use, and protect your information when you use our Android app.
        </Typography>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" component="h2" gutterBottom>
          1. Information We Collect
        </Typography>
        <Typography variant="subtitle2" gutterBottom>Personal Information:</Typography>
        <List dense>
          <ListItem>We do not collect your name, email address, or any directly identifying personal details.</ListItem>
          <ListItem>We use Firebase Authentication in anonymous mode only to create a unique, temporary ID for your session. This ID helps us manage usage data and protect the app but does not identify you personally.</ListItem>
        </List>
        <Typography variant="subtitle2" gutterBottom>Usage Data:</Typography>
        <List dense>
          <ListItem>We use Firebase Analytics to collect anonymous usage data to help us understand app performance and improve features.</ListItem>
          <ListItem>We use Firebase Crashlytics to collect crash reports and debug technical issues.</ListItem>
        </List>
        <Typography variant="subtitle2" gutterBottom>Scanned Content:</Typography>
        <List dense>
          <ListItem>The app lets you scan receipts and documents using Google ML Kit (Image Labeling, Document Scanner).</ListItem>
          <ListItem>All scanning happens locally on your device. Images and extracted text are not uploaded to any server.</ListItem>
        </List>
        <Typography variant="subtitle2" gutterBottom>Local Storage:</Typography>
        <List dense>
          <ListItem>Your scanned receipts and split details are saved only on your device using Room database.</ListItem>
          <ListItem>We do not store receipts or related data in the cloud.</ListItem>
        </List>
        <Typography variant="subtitle2" gutterBottom>Device Information:</Typography>
        <List dense>
          <ListItem>We may collect limited technical data (e.g., device type, OS version, IP address) to help protect the app from misuse using Firebase App Check.</ListItem>
        </List>
        <Typography variant="subtitle2" gutterBottom>Ads Data:</Typography>
        <List dense>
          <ListItem>We use Google AdMob to display ads. AdMob may collect device identifiers and usage data to show relevant ads.</ListItem>
        </List>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" component="h2" gutterBottom>
          2. How We Use Your Information
        </Typography>
        <Typography sx={{ mb: 2, display: 'block' }}>We use this information to:</Typography>
        <List dense>
          <ListItem>Provide core features (split receipts, local storage, scanning).</ListItem>
          <ListItem>Create a secure, anonymous session for app use.</ListItem>
          <ListItem>Analyze trends and improve the app.</ListItem>
          <ListItem>Debug crashes and errors.</ListItem>
          <ListItem>Serve ads, which may be personalized or non-personalized.</ListItem>
          <ListItem>Protect the app against fraud and abuse.</ListItem>
        </List>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" component="h2" gutterBottom>
          3. How We Share Your Information
        </Typography>
        <Typography sx={{ mb: 2, display: 'block' }}>
          We do not sell or rent your data. We may share data:
        </Typography>
        <List dense>
          <ListItem>With Google Firebase (for anonymous authentication, Analytics, Crashlytics, App Check).</ListItem>
          <ListItem>With Google AdMob (for ads).</ListItem>
          <ListItem>If required by law or to protect our rights.</ListItem>
        </List>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" component="h2" gutterBottom>
          4. Data Security
        </Typography>
        <Typography sx={{ mb: 2, display: 'block' }}>
          We rely on trusted security measures and Google’s secure infrastructure to protect your information. Your receipts are stored only on your device, so please protect your device with a password or lock screen.
        </Typography>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" component="h2" gutterBottom>
          5. Children’s Privacy
        </Typography>
        <Typography sx={{ mb: 2, display: 'block' }}>
          This app is not directed to children under 13. We do not knowingly collect personal information from children under 13.
        </Typography>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" component="h2" gutterBottom>
          6. Your Choices
        </Typography>
        <List dense>
          <ListItem>You can choose not to use features that require scanning.</ListItem>
          <ListItem>You control your receipts: they are stored only locally and can be deleted by you anytime.</ListItem>
          <ListItem>You can opt out of personalized ads through your device settings or Google Ads Settings.</ListItem>
        </List>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" component="h2" gutterBottom>
          7. Third-Party Services
        </Typography>
        <Typography sx={{ mb: 2, display: 'block' }}>We use these trusted third-party services:</Typography>
        <List dense>
          <ListItem>Google Firebase (Anonymous Auth, Analytics, Crashlytics, App Check)</ListItem>
          <ListItem>Google AdMob (Ads)</ListItem>
          <ListItem>Google ML Kit (local scanning only)</ListItem>
        </List>
        <Typography sx={{ mb: 2, display: 'block' }}>
          For more information, see:{' '}
          <Link href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Google Privacy Policy
          </Link>
        </Typography>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" component="h2" gutterBottom>
          8. Changes to This Policy
        </Typography>
        <Typography sx={{ mb: 2, display: 'block' }}>
          We may update this Privacy Policy. Updates will be posted here with a new effective date.
        </Typography>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" component="h2" gutterBottom>
          9. Contact Us
        </Typography>
        <Typography sx={{ mb: 2, display: 'block' }}>
          If you have questions, please contact us:
        </Typography>
        <Typography sx={{ mb: 2, display: 'block' }}>
          <strong>Email:</strong> <Link href="mailto:ilptokardeveloper@gmail.com">ilptokardeveloper@gmail.com</Link>
        </Typography>
        <Typography sx={{ mb: 2, display: 'block' }}>
          By using Receipt Splitter, you agree to this Privacy Policy.
        </Typography>
      </Paper>
    </Container>
  );
};

export default ReceiptSplitterPrivacyPolicyPage;

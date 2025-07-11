export const getPasswordResetTemplate = (url) => ({
  subject: "Password Reset Request",
  text: `You requested a password reset. Click on the link to reset your password: ${url}`,
  html: `<!doctype html><html lang="en-US"><head><meta content="text/html; charset=utf-8" http-equiv="Content-Type"/><title>Reset Password Email Template</title><meta name="description" content="Reset Password Email Template."><style type="text/css">a:hover{text-decoration:underline!important}</style></head><body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0"><!--100%body table--><table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;"><tr><td><table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0"><tr><td style="height:80px;">&nbsp;</td></tr><tr><td style="text-align:center;"></a></td></tr><tr><td style="height:20px;">&nbsp;</td></tr><tr><td><table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);"><tr><td style="height:40px;">&nbsp;</td></tr><tr><td style="padding:0 35px;"><h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have requested to reset your password</h1><span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span><p style="color:#455056; font-size:15px;line-height:24px; margin:0;">A unique link to reset your password has been generated for you. To reset your password, click the following link and follow the instructions.</p><a target="_blank" href="${url}" style="background:#2f89ff;text-decoration:none !important; font-weight:500; margin-top:24px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset Password</a></td></tr><tr><td style="height:40px;">&nbsp;</td></tr></table></td><tr><td style="height:20px;">&nbsp;</td></tr><tr><td style="text-align:center;"><p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy;</p></td></tr><tr><td style="height:80px;">&nbsp;</td></tr></table></td></tr></table><!--/100%body table--></body></html>`,
});

export const getVerifyEmailTemplate = ({ username, url }) => ({
  subject: "Verify Email Address",
  text: `Hi ${username || "there"},\n\nClick on the link to verify your email address: ${url}`,
  html: `<!doctype html>
<html lang="en-US">
<head>
  <meta charset="utf-8">
  <title>Verify Email Address</title>
  <meta name="description" content="Verify Email Address Email Template.">
  <style type="text/css">a:hover { text-decoration: underline !important; }</style>
</head>
<body style="margin: 0; background-color: #f2f3f8;">
  <table width="100%" bgcolor="#f2f3f8" style="font-family: 'Open Sans', sans-serif;">
    <tr><td>
      <table width="100%" align="center" cellpadding="0" cellspacing="0" style="max-width:670px; margin: 0 auto;">
        <tr><td style="height:80px;">&nbsp;</td></tr>
        <tr><td style="text-align:center;"></td></tr>
        <tr><td style="height:20px;">&nbsp;</td></tr>
        <tr><td>
          <table width="95%" align="center" cellpadding="0" cellspacing="0" style="background:#fff; border-radius:3px; text-align:center; box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
            <tr><td style="height:40px;">&nbsp;</td></tr>
            <tr><td style="padding:0 35px;">
              <h1 style="color:#1e1e2d; font-weight:500; font-size:32px;">Please verify your email address</h1>
              <span style="display:inline-block; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
              <p style="color:#455056; font-size:15px; line-height:24px;">Hi ${username || "there"}, click the button below to verify your email.</p>
              <a href="${url}" target="_blank" style="background:#2f89ff; color:#fff; padding:10px 24px; font-size:14px; border-radius:50px; display:inline-block; margin-top:24px; text-decoration:none;">Verify Email Address</a>
            </td></tr>
            <tr><td style="height:40px;">&nbsp;</td></tr>
          </table>
        </td></tr>
        <tr><td style="height:20px;">&nbsp;</td></tr>
        <tr><td style="text-align:center;"><p style="font-size:14px; color:#999;">&copy; Security Coursework App</p></td></tr>
        <tr><td style="height:80px;">&nbsp;</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
});


export const getMfaCodeTemplate = ({ username, code }) => ({
  subject: "Your MFA Verification Code",
  text: `Hi ${username || "there"},\n\nYour MFA verification code is: ${code}\n\nEnter this code to complete your login.\n\nIf you did not request this, please ignore this email.`,
  html: `<!doctype html>
<html lang="en-US">
<head>
  <meta charset="utf-8">
  <title>MFA Verification Code</title>
  <meta name="description" content="MFA Verification Code Email Template.">
  <style type="text/css">a:hover { text-decoration: underline !important; }</style>
</head>
<body style="margin: 0; background-color: #f2f3f8;">
  <table width="100%" bgcolor="#f2f3f8" style="font-family: 'Open Sans', sans-serif;">
    <tr><td>
      <table width="100%" align="center" cellpadding="0" cellspacing="0" style="max-width:670px; margin: 0 auto;">
        <tr><td style="height:80px;">&nbsp;</td></tr>
        <tr><td style="text-align:center;"></td></tr>
        <tr><td style="height:20px;">&nbsp;</td></tr>
        <tr><td>
          <table width="95%" align="center" cellpadding="0" cellspacing="0" style="background:#fff; border-radius:3px; text-align:center; box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
            <tr><td style="height:40px;">&nbsp;</td></tr>
            <tr><td style="padding:0 35px;">
              <h1 style="color:#1e1e2d; font-weight:500; font-size:32px;">Your MFA Verification Code</h1>
              <span style="display:inline-block; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
              <p style="color:#455056; font-size:15px; line-height:24px;">
                Hi ${username || "there"},<br><br>
                Use the following code to complete your login:
              </p>
              <div style="font-size:28px; letter-spacing:8px; font-weight:700; color:#2f89ff; margin:30px 0;">
                ${code}
              </div>
              <p style="color:#455056; font-size:14px; line-height:24px; margin-top:32px;">
                This code will expire in 5 minutes. If you did not request this code, please ignore this email.
              </p>
            </td></tr>
            <tr><td style="height:40px;">&nbsp;</td></tr>
          </table>
        </td></tr>
        <tr><td style="height:20px;">&nbsp;</td></tr>
        <tr><td style="text-align:center;"><p style="font-size:14px; color:#999;">&copy; Security Coursework App</p></td></tr>
        <tr><td style="height:80px;">&nbsp;</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
});


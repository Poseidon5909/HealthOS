import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
from app.core.security import create_email_verification_token, create_password_reset_token


class EmailService:
    """Email service for sending verification and password reset emails"""

    @staticmethod
    def send_email(to_email: str, subject: str, html_content: str, text_content: str = None):
        """
        Send an email using SMTP.
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            html_content: HTML version of the email
            text_content: Plain text version (optional)
        
        Note: Requires SMTP configuration in .env file
        """
        # Skip sending if SMTP is not configured
        if not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
            print(f"[EMAIL NOT SENT] SMTP not configured. Email to {to_email}: {subject}")
            return False
        
        try:
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
            message["To"] = to_email
            
            # Add text and HTML parts
            if text_content:
                part1 = MIMEText(text_content, "plain")
                message.attach(part1)
            
            part2 = MIMEText(html_content, "html")
            message.attach(part2)
            
            # Send email
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                server.send_message(message)
            
            print(f"[EMAIL SENT] To: {to_email}, Subject: {subject}")
            return True
        
        except Exception as e:
            print(f"[EMAIL ERROR] Failed to send to {to_email}: {str(e)}")
            return False

    @staticmethod
    def send_verification_email(email: str, name: str):
        """Send email verification link to user"""
        token = create_email_verification_token(email)
        verification_link = f"{settings.FRONTEND_URL}/verify-email?token={token}"
        
        subject = "Verify Your HealthOS Email"
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #4CAF50;">Welcome to HealthOS, {name}!</h2>
                <p>Thank you for registering. Please verify your email address to activate your account.</p>
                <p>Click the button below to verify your email:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{verification_link}" 
                       style="background-color: #4CAF50; color: white; padding: 12px 30px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                        Verify Email
                    </a>
                </div>
                <p style="color: #666; font-size: 14px;">
                    Or copy and paste this link in your browser:<br>
                    <a href="{verification_link}">{verification_link}</a>
                </p>
                <p style="color: #666; font-size: 14px;">
                    This link will expire in 24 hours.
                </p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="color: #999; font-size: 12px;">
                    If you didn't create this account, you can safely ignore this email.
                </p>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Welcome to HealthOS, {name}!
        
        Thank you for registering. Please verify your email address to activate your account.
        
        Click this link to verify your email:
        {verification_link}
        
        This link will expire in 24 hours.
        
        If you didn't create this account, you can safely ignore this email.
        """
        
        return EmailService.send_email(email, subject, html_content, text_content)

    @staticmethod
    def send_password_reset_email(email: str, name: str):
        """Send password reset link to user"""
        token = create_password_reset_token(email)
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        
        subject = "Reset Your HealthOS Password"
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #FF5722;">Password Reset Request</h2>
                <p>Hi {name},</p>
                <p>We received a request to reset your HealthOS password.</p>
                <p>Click the button below to reset your password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_link}" 
                       style="background-color: #FF5722; color: white; padding: 12px 30px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p style="color: #666; font-size: 14px;">
                    Or copy and paste this link in your browser:<br>
                    <a href="{reset_link}">{reset_link}</a>
                </p>
                <p style="color: #666; font-size: 14px;">
                    This link will expire in 1 hour for security reasons.
                </p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="color: #999; font-size: 12px;">
                    If you didn't request a password reset, please ignore this email or contact support if you're concerned.
                </p>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Password Reset Request
        
        Hi {name},
        
        We received a request to reset your HealthOS password.
        
        Click this link to reset your password:
        {reset_link}
        
        This link will expire in 1 hour for security reasons.
        
        If you didn't request a password reset, please ignore this email or contact support if you're concerned.
        """
        
        return EmailService.send_email(email, subject, html_content, text_content)

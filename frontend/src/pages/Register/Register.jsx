import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Dumbbell, Scale, TrendingDown } from 'lucide-react';
import authService from '../../services/authService';
import { BrandMark } from '../../components/ui';
import { saveNutritionProfile } from '../../services/nutritionTargetsService';
import {
  isValidEmail,
  validatePassword,
  passwordsMatch,
  parseErrorMessage,
} from '../../utils/validation';

function Register() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    age: '',
    weight: '',
    height: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [focusedInput, setFocusedInput] = useState('');
  const [hoveredButton, setHoveredButton] = useState('');

  const totalSteps = 4;

  const mapGoalToProfileGoal = (goal) => {
    if (goal === 'build') {
      return 'gain';
    }

    return goal;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleSelectGoal = (goal) => {
    setFormData((prev) => ({ ...prev, goal }));
    if (error) setError('');
  };

  const handleNext = () => {
    if (currentStep === 1 && !formData.name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (currentStep === 2 && !formData.goal) {
      setError('Please select your goal');
      return;
    }
    if (currentStep === 3) {
      if (!formData.age || !formData.weight || !formData.height) {
        setError('Please fill in all fields');
        return;
      }
      if (formData.age < 13 || formData.age > 120) {
        setError('Please enter a valid age');
        return;
      }
    }

    setError('');
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizedEmail = formData.email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      setError('Please enter a valid email');
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
      return;
    }

    if (!passwordsMatch(formData.password, formData.confirmPassword)) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.register({
        name: formData.name.trim(),
        email: normalizedEmail,
        password: formData.password,
      });

      // Create an initial nutrition profile so downstream pages
      // (daily targets, workouts, nutrition calculations) don't fail.
      const authTokens = await authService.login(normalizedEmail, formData.password);
      
      localStorage.setItem('accessToken', authTokens.access_token);
      localStorage.setItem('refreshToken', authTokens.refresh_token);

      try {
        await saveNutritionProfile(
          {
            height: Number(formData.height),
            weight: Number(formData.weight),
            age: Number(formData.age),
            gender: 'other',
            activity_level: 'moderate',
            goal: mapGoalToProfileGoal(formData.goal),
          },
          false
        );
      } catch (profileError) {
        // Log profile creation error but don't block registration
        console.error('Failed to create nutrition profile:', profileError);
        setError('Account created, but profile setup incomplete. You can complete it later.');
        setSuccess(false);
        setIsLoading(false);
        return;
      }

      // Only clear tokens after both registration and profile creation succeed
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      // Clear tokens on registration error
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setError(parseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
    },
    leftPanel: {
      flex: 1,
      background: 'linear-gradient(145deg, #1a56db 0%, #6366f1 50%, #a855f7 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px',
    },
    leftContent: {
      textAlign: 'center',
      color: 'white',
    },
    tagline: {
      fontSize: '20px',
      opacity: 0.6,
      lineHeight: 1.6,
    },
    rightPanel: {
      width: '500px',
      flexShrink: 0,
      background: 'white',
      padding: '64px 48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflowY: 'auto',
    },
    formContainer: {
      width: '100%',
      maxWidth: '400px',
    },
    stepIndicator: {
      display: 'flex',
      gap: '8px',
      justifyContent: 'center',
      marginBottom: '32px',
    },
    stepDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      transition: 'all 0.3s ease',
    },
    backButton: {
      background: 'none',
      border: 'none',
      color: '#64748b',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      marginBottom: '16px',
      padding: 0,
    },
    heading: {
      fontSize: '26px',
      fontWeight: 800,
      color: '#0f172a',
      marginBottom: '8px',
    },
    subtitle: {
      fontSize: '15px',
      color: '#64748b',
      marginBottom: '32px',
    },
    input: {
      width: '100%',
      height: '56px',
      background: '#f1f5f9',
      border: 'none',
      borderRadius: '12px',
      padding: '0 20px',
      fontSize: '15px',
      fontFamily: 'inherit',
      outline: 'none',
      transition: 'all 0.2s ease',
      marginBottom: '16px',
    },
    inputFocused: {
      background: 'white',
      border: '1.5px solid #1a56db',
      boxShadow: '0 0 0 3px rgba(26, 86, 219, 0.1)',
    },
    goalCard: {
      width: '100%',
      padding: '16px 20px',
      border: '1.5px solid #e2e8f0',
      borderRadius: '14px',
      background: 'white',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: 600,
      textAlign: 'left',
      marginBottom: '12px',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    goalCardSelected: {
      borderColor: '#1a56db',
      background: '#eff6ff',
    },
    detailsGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      marginBottom: '16px',
    },
    detailInputWrapper: {
      display: 'flex',
      flexDirection: 'column',
    },
    detailLabel: {
      fontSize: '13px',
      fontWeight: 600,
      color: '#64748b',
      marginBottom: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    detailInputGroup: {
      position: 'relative',
    },
    detailInput: {
      width: '100%',
      height: '56px',
      background: '#f1f5f9',
      border: 'none',
      borderRadius: '12px',
      padding: '0 48px 0 20px',
      fontSize: '15px',
      fontFamily: 'inherit',
      outline: 'none',
      transition: 'all 0.2s ease',
    },
    detailUnit: {
      position: 'absolute',
      right: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '14px',
      color: '#94a3b8',
      fontWeight: 600,
      pointerEvents: 'none',
    },
    passwordContainer: {
      position: 'relative',
      marginBottom: '16px',
    },
    eyeButton: {
      position: 'absolute',
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#64748b',
      padding: '8px',
      display: 'flex',
      alignItems: 'center',
    },
    button: {
      width: '100%',
      height: '56px',
      background: '#1a56db',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginTop: '8px',
    },
    buttonHovered: {
      transform: 'translateY(-1px)',
      boxShadow: '0 8px 16px rgba(26, 86, 219, 0.3)',
    },
    buttonDisabled: {
      background: '#94a3b8',
      cursor: 'not-allowed',
    },
    error: {
      padding: '12px 16px',
      background: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      color: '#dc2626',
      fontSize: '14px',
      marginBottom: '16px',
    },
    linkContainer: {
      textAlign: 'center',
      marginTop: '24px',
      fontSize: '14px',
      color: '#64748b',
    },
    link: {
      color: '#1a56db',
      fontWeight: 600,
      textDecoration: 'none',
    },
    successContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #1a56db 0%, #6366f1 50%, #a855f7 100%)',
    },
    successCard: {
      background: 'white',
      padding: '48px',
      borderRadius: '24px',
      textAlign: 'center',
      maxWidth: '400px',
    },
    successIcon: {
      width: '64px',
      height: '64px',
      background: '#dcfce7',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 24px',
      fontSize: '32px',
    },
  };

  if (success) {
    return (
      <div style={styles.successContainer}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}><CheckCircle2 size={32} color="#16a34a" /></div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px', color: '#0f172a' }}>
            Welcome to HealthOS!
          </h2>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            Your account has been created successfully.
          </p>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px' }}>
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  const goals = [
    { emoji: <TrendingDown size={22} color="#1a56db" />, label: 'Lose Weight', value: 'lose' },
    { emoji: <Dumbbell size={22} color="#1a56db" />, label: 'Build Muscle', value: 'build' },
    { emoji: <Scale size={22} color="#1a56db" />, label: 'Maintain Weight', value: 'maintain' },
  ];

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
          
          * {
            box-sizing: border-box;
          }
        `}
      </style>
      <div style={styles.container}>
        <div style={styles.leftPanel}>
          <div style={styles.leftContent}>
            <BrandMark
              subtitle="Track every meal. Every rep. Every goal."
              containerStyle={{
                flexDirection: 'column',
                gap: 0,
              }}
              titleStyle={{
                marginTop: 24,
                textAlign: 'center',
              }}
              subtitleStyle={{
                maxWidth: 280,
                textAlign: 'center',
              }}
            />
          </div>
        </div>

        <div style={styles.rightPanel}>
          <div style={styles.formContainer}>
            <div style={styles.stepIndicator}>
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  style={{
                    ...styles.stepDot,
                    background: step === currentStep ? '#1a56db' : '#cbd5e1',
                  }}
                />
              ))}
            </div>

            {currentStep > 1 && (
              <button onClick={handleBack} style={styles.backButton}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <ArrowLeft size={14} /> Back
                </span>
              </button>
            )}

            {error && <div style={styles.error}>{error}</div>}

            {currentStep === 1 && (
              <div>
                <h2 style={styles.heading}>What's your first name?</h2>
                <p style={styles.subtitle}>
                  We're happy you're here. Let's get to know you.
                </p>
                <input
                  type="text"
                  name="name"
                  placeholder="First Name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('name')}
                  onBlur={() => setFocusedInput('')}
                  style={{
                    ...styles.input,
                    ...(focusedInput === 'name' ? styles.inputFocused : {}),
                  }}
                />
                <button
                  onClick={handleNext}
                  onMouseEnter={() => setHoveredButton('next1')}
                  onMouseLeave={() => setHoveredButton('')}
                  style={{
                    ...styles.button,
                    ...(hoveredButton === 'next1' ? styles.buttonHovered : {}),
                  }}
                >
                  Next
                </button>
                <div style={styles.linkContainer}>
                  Already have an account?{' '}
                  <Link to="/login" style={styles.link}>
                    Sign In
                  </Link>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 style={styles.heading}>What's your goal?</h2>
                <p style={styles.subtitle}>This helps us personalize your plan.</p>
                {goals.map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => handleSelectGoal(goal.value)}
                    style={{
                      ...styles.goalCard,
                      ...(formData.goal === goal.value ? styles.goalCardSelected : {}),
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{goal.emoji}</span>
                    <span>{goal.label}</span>
                  </button>
                ))}
                <button
                  onClick={handleNext}
                  onMouseEnter={() => setHoveredButton('next2')}
                  onMouseLeave={() => setHoveredButton('')}
                  style={{
                    ...styles.button,
                    ...(hoveredButton === 'next2' ? styles.buttonHovered : {}),
                  }}
                >
                  Next
                </button>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2 style={styles.heading}>Tell us about yourself</h2>
                <p style={styles.subtitle}>This helps us calculate your personalized plan.</p>
                <div style={styles.detailsGrid}>
                  <div style={styles.detailInputWrapper}>
                    <label style={styles.detailLabel}>Your Age</label>
                    <div style={styles.detailInputGroup}>
                      <input
                        type="number"
                        name="age"
                        placeholder="25"
                        value={formData.age}
                        onChange={handleChange}
                        onFocus={() => setFocusedInput('age')}
                        onBlur={() => setFocusedInput('')}
                        style={{
                          ...styles.detailInput,
                          ...(focusedInput === 'age' ? styles.inputFocused : {}),
                        }}
                      />
                      <span style={styles.detailUnit}>years</span>
                    </div>
                  </div>

                  <div style={styles.detailInputWrapper}>
                    <label style={styles.detailLabel}>Current Weight</label>
                    <div style={styles.detailInputGroup}>
                      <input
                        type="number"
                        name="weight"
                        placeholder="70"
                        value={formData.weight}
                        onChange={handleChange}
                        onFocus={() => setFocusedInput('weight')}
                        onBlur={() => setFocusedInput('')}
                        style={{
                          ...styles.detailInput,
                          ...(focusedInput === 'weight' ? styles.inputFocused : {}),
                        }}
                      />
                      <span style={styles.detailUnit}>kg</span>
                    </div>
                  </div>

                  <div style={styles.detailInputWrapper}>
                    <label style={styles.detailLabel}>Your Height</label>
                    <div style={styles.detailInputGroup}>
                      <input
                        type="number"
                        name="height"
                        placeholder="170"
                        value={formData.height}
                        onChange={handleChange}
                        onFocus={() => setFocusedInput('height')}
                        onBlur={() => setFocusedInput('')}
                        style={{
                          ...styles.detailInput,
                          ...(focusedInput === 'height' ? styles.inputFocused : {}),
                        }}
                      />
                      <span style={styles.detailUnit}>cm</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleNext}
                  onMouseEnter={() => setHoveredButton('next3')}
                  onMouseLeave={() => setHoveredButton('')}
                  style={{
                    ...styles.button,
                    ...(hoveredButton === 'next3' ? styles.buttonHovered : {}),
                  }}
                >
                  Next
                </button>
              </div>
            )}

            {currentStep === 4 && (
              <form onSubmit={handleSubmit}>
                <h2 style={styles.heading}>Create your account</h2>
                <p style={styles.subtitle}>Just one more step to get started.</p>
                
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput('')}
                  style={{
                    ...styles.input,
                    ...(focusedInput === 'email' ? styles.inputFocused : {}),
                  }}
                />

                <div style={styles.passwordContainer}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput('')}
                    style={{
                      ...styles.input,
                      marginBottom: 0,
                      ...(focusedInput === 'password' ? styles.inputFocused : {}),
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div style={styles.passwordContainer}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput('confirmPassword')}
                    onBlur={() => setFocusedInput('')}
                    style={{
                      ...styles.input,
                      marginBottom: 0,
                      ...(focusedInput === 'confirmPassword' ? styles.inputFocused : {}),
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeButton}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  onMouseEnter={() => setHoveredButton('submit')}
                  onMouseLeave={() => setHoveredButton('')}
                  style={{
                    ...styles.button,
                    ...(hoveredButton === 'submit' && !isLoading ? styles.buttonHovered : {}),
                    ...(isLoading ? styles.buttonDisabled : {}),
                  }}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;



export const emailLetterForRecoveryPassword=(recoveryCode:string)=>{

    const letter = `<h1>Password recovery</h1>
 <p>To finish registration please follow the link below:
     <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
 </p>`

    return letter
}



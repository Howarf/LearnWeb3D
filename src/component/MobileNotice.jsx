import styles from '../css/mobileNotice.module.css';

function MobileNotice() {
  const currentUrl = window.location.href

  return (
    <div className={styles.main}>
      <div className={styles.headerIcon}>🖥️</div>
      <h1 className={styles.headerText}>
        PC에서 접속해 주세요
      </h1>
      
      <p className={styles.mainText}>
        본 프로젝트는 마우스 기반 3D 인터랙션으로 제작되어
        PC 환경에 최적화되어 있습니다.
      </p>

      <div className={styles.inductionLink}>
        <div className={styles.inductionText}>접속 주소</div>
        {currentUrl}
      </div>

      <a href="https://github.com/Howarf/LearnWeb3D" className={styles.Link}>
        GitHub 저장소 보기 →
      </a>
    </div>
  );
}

export default MobileNotice;
import styles from "pages/interface/styles/buildAnimation.module.css";

function BuildAnimation() {
  return (
    <div className={styles.crane}>
      <div className={styles.construction_plaque}>
        <p>
          PÁGINA EM <br />
          CONSTRUÇÃO
        </p>
      </div>
      <div className={styles.crane_jib}>
        <span></span>
        <span></span>
      </div>
      <div className={styles.crane_jib_head}></div>
      <div className={styles.crane_jib_head_rope}>
        <div></div>
        <div>
          <span className={styles.crane_jib_head_hook}></span>
        </div>
      </div>
      <div className={styles.crane_body}>
        <div className={styles.crane_body_cabin}>
          <div className={styles.crane_body_cabin_door}></div>
        </div>
        <div className={styles.crane_body_engine}>
          <div>
            <span>0</span>
          </div>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className={styles.crane_caterpillar}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

export default BuildAnimation;

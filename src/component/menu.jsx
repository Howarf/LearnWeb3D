import { useState } from 'react';
import styles from '../css/menu.module.css'
import { Link } from 'react-router-dom';

export default function Menu(){
    const [menu_s, setMenu_s] = useState(false);
    const [btn_s, setBtn_s] = useState(false)

    function MenuClick(){
        const menu = document.getElementById('menu');
        if(!menu_s){
            menu.animate(
                [{transform:"translateX(0%)"},{transform:"translateX(100%)"}],
                { fill:"forwards", duration:300,}
            );
            setMenu_s(true);
            setBtn_s(true);
        }else{
            menu.animate(
                [{transform:"translateX(100%)"},{transform:"translateX(0%)"}],
                { fill:"forwards", duration:300,}
            );
            setMenu_s(false);
            setBtn_s(false);
        }
    }
    function MenuLeave(){
        const menu = document.getElementById('menu');
        if(menu_s){
            menu.animate(
                [{transform:"translateX(100%)"},{transform:"translateX(0%)"}],
                { fill:"forwards", duration:300,}
            );
            setMenu_s(false);
            setBtn_s(false);
        }
    }
    function MenuClick2(e){
        const menu = document.getElementById(e.target.getAttribute('name'));
        if(window.getComputedStyle(menu).display === "none"){
            menu.setAttribute("style", "display:flex");
            menu.animate([{transform:'translateY(-100%)'}, {transform:'translateY(0%)'}], {fill:'forwards', duration:100});
        }else{
            menu.setAttribute("style", "display:none");
            menu.animate([{transform:'translateY(0%)'}, {transform:'translateY(-100%)'}], {fill:'forwards', duration:100});
        }
    }

    return(
        <div className={styles.menu} id='menu' onMouseLeave={MenuLeave}>
            <div className={styles.menuBtn} id={btn_s ? (styles.close) : (styles.opne)} onClick={MenuClick}>
                <span className={styles.btnDising} id={styles.btnDising1}></span>
                <span className={styles.btnDising} id={styles.btnDising2}></span>
                <span className={styles.btnDising} id={styles.btnDising3}></span>
            </div>
            <div className={styles.menuBox}>
                <Link to={'/'}><h1>Example</h1></Link>
                <span className={styles.subTitle1} name="menu_1" onClick={MenuClick2}>시작 예제</span>
                <div className={styles.listBtn1}>
                    <ul className={styles.menuList1} id='menu_1'>
                        <Link to={'/Cube'}><li>기본 큐브</li></Link>
                        <Link to={'/UiPairing'}><li>Ui 연동하기</li></Link>
                        <Link to={'/Mix_Controlls'}><li>여러가지 컨트롤러</li></Link>
                        <Link to={'/Mix_HTML'}><li>HTML로 제어하기</li></Link>
                        <Link to={'/CanvasWithText'}><li>캔버스에글자넣기</li></Link>
                        <Link to={'/ScrollCanvas'}><li>캔버스에 스크롤적용</li></Link>
                        <Link to={'/LoadGLTF'}><li>모델링 불러보기</li></Link>
                        <Link to={'/HTML_annotation'}><li>오브젝트에 HTML주석달기</li></Link>
                    </ul>
                </div>
                <span className={styles.subTitle1} onClick={MenuClick2} name="menu_2">물리엔진 예제</span>
                <div className={styles.listBtn1}>
                    <ul className={styles.menuList1} id='menu_2'>
                        <Link to={'/SimplPhysics1'}><li>기초물리1</li></Link>
                        <Link to={'/TriggerEvent'}><li>트리거 이벤트</li></Link>
                        <Link to={'/SimpleArkanoid'}><li>간단한 공튀기기</li></Link>
                        <Link to={'/CharacterMove'}><li>케릭터 컨트롤</li></Link>
                        <Link to={'/MyPhysics'}><li>테스트공간</li></Link>
                        <Link to={'/RollTheDice'}><li>주사위 굴리기</li></Link>
                    </ul>
                </div>
            </div>
        </div>
    )
}
const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const images = [
  {
    nome_alvo: "catedral-panoramica-elevada.webp",
    tipo: "card_16_9",
    destinos: [
      path.join(__dirname, '../../public/images/home/catedral-panoramica-elevada.webp'),
      path.join(__dirname, '../../public/images/comunidades/catedral-sede-fachada.webp')
    ],
    width: 1600,
    height: 900,
    quality: 80,
    url: "https://lh3.googleusercontent.com/pw/AP1GczNDOJAdbKd7dLx3r-_QBNvk8sqnXmAtIsdI--IZYFj9mZTFnxI2m4sferWMdUp0LMBzoUktX6jVaQneHEt0hW11oZQr2do8sOFPhEctP-S7G1HaSBNcisHm971BBZi8To7NhwJErvCdW2GwJfAdYMEU3U8JmtOawOh8oolH30u3MqUkYcpU3-h2aYeFgan9KfFvjrMTiHAwJrIR7Q0qys20ENXCBhw4ExUehLHa_cRHHVuRK998SENzL_sWIZTLOJLXBskGwRnWN_jhYtNvbzUBqYdSAAgK30_mWBs1yEdx19aNtqAj7ltnEugUsqYsdvqKmIhK0zgL_XmISXlMqz2CpXRwU8q_TgU1R9SHzM130ihpyETR0j4mW40q3BLXdcpRoYDig1tCp_7PhUDLgSsPmSe6aVn5E8N5A5Ytd_bwFFNe8xZ07JBgZjmjcnBY9NlZii1SAW0pb38K-m5LAt3QJuzfgRgo8BlFdsRx8_HLf2ryEZLm4DmeYrhWGw2aVtTpnBXYjk0_2qBdnW5jEDgrd2rXRR5If7RaCVi7RyIGs1EHvLWP72Kdp_Yf3dVoe8TVeG4VJb6lReeyZrw-GIlkba6UL6bjYAD29UQO4HPQm9tELP2ojXY8aSVzHtbu5ex_v4VPpBHUzscacxYZMhuFhLOD8dj1UbPijAdESXUFPJhBQlFkeqdrHklxf4-Gj0RmHPB55gGkepBF9_bNopQZZa1rtnEuVhBjlWoo4_HWwa0tcY-P47ZOus2OhBRQL5tS282zxVpUAAGBI46llyz7KexNozKrjFfopGsGyxqhdwk9p8Q5g54lYIpLWWW41_VlRBQcmvvysJSft1Dd6Bb0EWEkVmS6awl26I0XPqFRNgOcZtBCd1cm4mYCV01ehRuaF6zzzL5HGQ7_TsS3LC80XjObLIlJjvySVdcKCyJPrmsd0kRDVsNeu4Pwitkv2L9bXuzfYIg6uDVKHy_qupWJ1CNjgb4ktk_Sgdsm0cCL7XQ3oRVskjQrfBrPPFaAIuySZF7bJ82Jf-3tJ2IDjLSlKFXx3ebnofJ54y92M8JhECYgez7X-CE3rTR5kqy0mAEMh5CZ-fwDG5tD7MK1qdvKRiRbzxjwBA3D=w2048-h2048-no"
  },
  {
    nome_alvo: "catedral-fachada-noturna.webp",
    tipo: "card_16_9",
    destinos: [
      path.join(__dirname, '../../public/images/festas/natal-catedral-2026.webp'),
      path.join(__dirname, '../../public/images/galleries/arquitetura/catedral-fachada-noturna.webp')
    ],
    width: 1600,
    height: 900,
    quality: 80,
    url: "https://lh3.googleusercontent.com/pw/AP1GczMotd_llrzDo129azZBwAS6Up0ATBcm-fGyF8om0prUW0XiWcfqu7T1G2tMElY_ODLRPeHHaZr5xWYOgvj_e33-xz8VGObH_bmu1y4kT0ckrZHLWL5y3RTLdStCadlPhWFHOAkArLIr8xsdmkO9TJ7ltqkssRME7Xt-0VtjqYpjoXF2X7qzF_FNe5Uf3Hveb9Bfr0RBprS3XQfzYzVXpJG56snPKnAtXkM_f4r5ymCProbX8W4OPUCAwr8JuS_y4LvlM7HQGxG0RJY0o7ydQ3XOlw08f3Bxg7OD4dbykdCSM_VTcENyTtoUPFPRaGWd__Sfcgj5poeEzi-XwhhSHihuyilAE8ZGIUpjneX2bjfY4rGkLuGm4eEcUOGvxn_X2vI9E38IA_9ZWL127FgCwB_RxnWRI4lTsIF1Alv4JzRuY_7tH4WnozX33QJ6acl6GTS4ErbqRfV5ttxjdt6tPQHF_M3yPrYJW_f4i1sSIw6kv9vo3mk4neCvrI2WYgKQc_JdACnjXj0FNpBruuj2MFhprVZa71avcF2zfVynWZtWeaC4VT1_qff1ksvz0GJXwBmcsGBIYEgxA0dlzrIzBeoiyN4p_xiUCUD2I1yVBJx94DDatr8gqseX33apQNs-KGVkVg10MpJ4sWrrdyWPLQaFMu3zDBTfE44NwpHw_RWBzSLxjqYrlr6ss3kNwy-1XYZzyMr4_fWru7UI7pDG7sqavEuQCTHGHr22gUEb-ioRg03jUqm2-qyQGlcwL3LYgUx2z0kswI8W2lPu-gvPMvkVFLtKI5rA7klBAFcWm1bVey9U2UD6xLp3CaaI9THeMFmyofcuoZ1A_6mCWw3rjX-Cl52eGG0lCH7T1mumkIHgRG48MAxED6foo0VK8yP2HDfwzfQgC6Xhvc9Os-M2a4jCpXR3VfxfDEgdzaQZ50k6WU3-EMZeaqKDIXNxo_elfKJNGJ_K7hLpOFwzMiqfty_9_oCdUzcfaIDsGk7JRVVSqmvurb2SQBYMPlKkYI80cnmmEACpLKRUSQXP4GLPmCqeikJa3-7w8IDxFraEruq2_345YQ7UiyOgMWpAAQPz2UXcVqrEJU7KAI-tLn0GDMFFKCC8v04k4uA0=w2048-h2048-no"
  },
  {
    nome_alvo: "catedral-fachada-diurna-avenida.webp",
    tipo: "portrait_4_5",
    destinos: [
      path.join(__dirname, '../../public/images/historia/fachada-frontal-limpa.webp'),
      path.join(__dirname, '../../public/images/galleries/arquitetura/fachada-frontal-limpa.webp')
    ],
    width: 600,
    height: 750,
    quality: 80,
    url: "https://lh3.googleusercontent.com/pw/AP1GczNh9mllZxoLozxGqdDZYminCVk3yXUpcuvd1aIvAkLLEopa3ge6CVtFUl1ffFwj3pnM_SRu6v3qCosuMaOj8HLamAO4EXTvH8FuGczR82Tfj3HQOLLsJ4x08-y2odFBOx-mP9_V37F-38T_OeltBdoPWkigEuLoymxvBfaJj01mYa0sBDd_NaQCTuJ2rye9yrZVbGyXHCbMwraTpDi57xTAOxYN3ARYReoEm8_QBMIYF5qPpv13LAiv9PTFe1WvGzxkt7Zud3B_yGDr1tKSaGVVQAFNKao6cm6fSxZyimL7Tueqcr-2X6yQa2SvfSnV3nrPRwlY1B4XGufh39wFP9VZZkubOdTu0GrcKSGouLk9ZstqX1mvXlM1N60Cn-fCkrF5sWWOdwWTF94PsbARbmoZcSjXfhjAEuKs7WOkkDZiTFfMVAr0D8kruXCWTlw7knkLD9bvU1mYwiRlCx2dx33cviqVoruHI2dDPbcclGhor0NzPdvVEwRzL57FfcR_6rOjBQEA5kZvasEow55PMdKcn30xnGsnXbbHhiazsFsemwi-wK5Ue5TSWrUq4ScDKOQrb5hWMmSUSKbyCKWO5N2-f9lLRZauTp0OiTRLfqg_Nx7JbFauamg9c8ZOzQEZcPkkgf7lXvn244v2zz7D6xwy7wBmci_44ADdIusDLiDXfjY5ODEGdW1O1PJfODRNB8NU3z4XOXizcffeN6_cQsyxeu5dM7yCy-d6LoDDXR81clr1_eXvVkzpTW_dbs0U4avIO7ir5Kvno7v-MyOHWI9JabDEqkpRAdphIuZOmye-j1V4GKpsF2nNmbHWQrcSWKs5aPqTUMH2QjXNeq65omTtAjFr9cRyp6o1rh2JYIaZgQ9BfniFbGvlodYRMACMe3BoiT7yaphVgpTuoJlg5VzLU01CYaSYJpkSP0iwzjHklLviWXWgYW7-xicczk9anmv41GxWtxhPtzi0d5OPZo88dbR9A1J2MqOYe4-XfLQvJsNR014LUH9jz3wojc6zP2s0tagqFwo_HLGWQbHeG4eqUR2mY_zxEIXH54AGRmF7xVSmpUMN-Tqp7Zq29TB3DNZjJ1MhRqkCGABfQj1Sd-awNebTRdhZ7Yy6=w2048-h2048-no"
  },
  {
    nome_alvo: "catedral-galeria-fachada-04.webp",
    tipo: "portrait_4_5",
    destinos: [path.join(__dirname, '../../public/images/galleries/arquitetura/catedral-galeria-fachada-04.webp')],
    width: 600,
    height: 750,
    quality: 80,
    url: "https://lh3.googleusercontent.com/pw/AP1GczMdiciRCXb5gX8F1jI6kOwm1-6xZrjZRfIfQUYSGiLgNwHM6ki4fP5Qchf7i2SGRqyHe9livU28CGJonYog2uoIU5Gn_zv3WY9WLbE5sNLiGO-O1lZA_AFpcEnkKEOCts8GAcvqHGVR9315E3CYNmUYzkf_BIo_3MSkyLFVRNkC_u58tsUrIC2qoRCVfNf9mol9fIKYNLgssEzNJezlBewrZU0WECFZYn9NdlRcoTZIWZYpUOQ80pQP8I-VG0_tGOS0RiLF4ULAmF_xtYzzC7aBmi3CI0DBHVRUdzd7ae4F7qxi7QshYnfeEqdw4Jy126JtSo0fG9zaBq97qJMa0_AcR-ZyYlH45N0giSJl6dPNRuqbrtjnFE-KuzywPr3Hsbws81ls_mOANN9LSYOBW8QfQ_16ceMSZ9WWU4sRH3gH2Zq-5dsQYHTGkpW3TEGz2h6dC4E6_fR28lX0ud3TEmvqIBZVaGWVpKZiWgoApBCe36Bb26RcQ7auB1kfwuoE4TiOKCEMPFJnG7cTF7RY0yO2Me5JkKb-_Gw_v45fAVkuWm8A80dqyVcO0JnnP2Xl1My8fF1Z_IksGzNkn8Mb4ojqFxUFP815Unx4FR-0jTF0O4_BbF_uaZwBFL6FX2Yc3Llbp5FN8qHHE--nuj5FjSRKE5gkTbq9cum1UuKV-l06ufO_5JVoEjMUoXka34fKHv-WPW-AgLxUzah9n3vBAcm5o79MdnPlZSnkQ6koRBKTUytJMZPTBzYPcatzv2j-22HADajNrgvQktAxr58Ix1Efa7i5gGgwwdZ0-xKFtt5alTF7gdebCKlWvQQVWsFqQ_9KdgBberiux_NVcliHU8Az9NeILhWBVFbImRW1sQEctidxEYTgnIjG8esxSnbH1UgyFOFsEd5rkT2XzjaTu3CtcE2teKX6W00T1etLXt1_DZXnK7r5UswNbefzLGsEaxbVAjy3Ldu5oNVKiRiBW_YLPMBx9wvq0w8X8mgZUd1XT2XgruOsu7xZ1bD5AGHxugKoLPf_A9PsEWRYb_U8Ax2BFYOFL_abVdCAvbHdtos5PSb7D_j4QTWeSSnPKewM6ED_TQFWNTl4PTf8gN1oL20k9ifLfX4QCXL0=w2048-h2048-no"
  },
  {
    nome_alvo: "catedral-galeria-fachada-06.webp",
    tipo: "portrait_4_5",
    destinos: [path.join(__dirname, '../../public/images/galleries/arquitetura/catedral-galeria-fachada-06.webp')],
    width: 600,
    height: 750,
    quality: 80,
    url: "https://lh3.googleusercontent.com/pw/AP1GczNBqCRqlEvPssY7OqXtHNC0wPE4hPV-351gXTThllwjCww3BMjgkY0BCNEsbJhtL6mmLVaP9ZGYYxXmd-OZfHjo4SpV3x6NmUR26RMK6C1ktZl7pe2QxoJQAOlMDsLx_r7kQGwPiKu2-gt-MJY6VPYxnYao8_fa2LgyOy5YHnUesEX5A9JwBCSzT4GDt0phz-hCsPsni_I29M77Q1mdJ1MivsQiMFCiG1OjXNNkDhfj3H-oShH7BRXmAodxErbTKud-bnu6ZP-NaCkEymO-ojPH7VP5vSQJsqyPq8u4cSyRJFYdV5F1m2kwWA2EOXAqKtpw_GbDVeR3tN9_ZrpsUY87Jke0Bzf0Jtqt_kzBiLV2q0bXt9J6uTPx4oV01MHlZIzf5IRwRgoGiW573wKbGRRuuE_hqux36RLHH9NJgIjr-bnrnQCRNJvV_8C0xbb4_pvTaiDwrqxDEMjiZY-HrEFshzAN_0dL7-piuSFQ02qGVTojRORy1CFleJ6JTl4A2YmEKEIj5SALptv4tZlIuWp99C6na5FKZK1FmF_KpcXT1Db_oUunK53sOpj_Be2L9JFEJ1_cHgwshFKYayirsIsokxxoTokZSYYexR-YojmET8MQh4q3hJ2DR9xR6Jbb6Y3u6UIg_qfO7eYPAITu24u4Dv1ghSM_KJeyd2EhYlJVk6LfiT0LOGvhIZPzfD2wn48l4gaUytAEDCbUYKI7tQ_7AKajCo8BvjuFG0no69QEuatY5FZ_RDEOFXoX09RuygI1cLjVrrU4bGkGfoBH0jptGTUH5AekMaqCezOsrUu9-WYUmahddspSrANaR-iMKgHLQmuxLBh7cU4H5i_AcWOZ0vkMKpaVPIsBpTvWfRTgDvvvItgbVk09NEPfjaWLBeUzcH2nPvoo2gJ1PgRDU-FyYH4mjbo2WK1n1OtdbfY9uAij8m9M8AN9iVzxo0XuxTXxZHhLhnbSZWXrQEf-2UaOA25ner22b5l_6Q2gGfB1uE4soESmjwSWXB0LePevSGjACj-AAdZmCJzYBeVRmEzxNI6xP3yfMHcl7LaiM1i4swDjo0LlffjToJfxC91CLLRPj-_nLUf-jlBP82XbM8oRYrqsL9GfLNii=w2048-h2048-no"
  },
  {
    nome_alvo: "catedral-galeria-fachada-07.webp",
    tipo: "portrait_4_5",
    destinos: [path.join(__dirname, '../../public/images/galleries/arquitetura/catedral-galeria-fachada-07.webp')],
    width: 600,
    height: 750,
    quality: 80,
    url: "https://lh3.googleusercontent.com/pw/AP1GczMdxhJMyf2VCrjL9pCRiFSwHDdm3tIVfDcFixFuRno2p0Iw0VXep4UTS3isWdsmnGD5EFytuf3muo0A20jIHHj_NDFiMAt04iIus5C2QN4RrlKdQujrFh9Bx4J7zBzPwbT7PSL1wJ08O3iyopSv4yV7i_b524iBDaDpuA9d0uH09UHfCHB6JN_oO_cPU-JLmhU51a18ZqKDRm4rIwzA0o2VW7F9E1os424B0bCpNHCqjjPwZfplRNnLm_MAtQt7topIXXx2btmkjiEqONO0kFzkYpHd4d6Op2AA_X9iEbps9_uK1SMkcsUKdKrcszKo8fnsUBejp78QfmVzFyswX9rHsxg641NmWiOBENhblCboXdAHezTdR8ayxKNJkPlvjGKoSREuokSrFz0HlWaTXbFOOONerlDhVBNpkk8tJZcIwHkwKbu94DTKUnj6eC-QPXd_9ZYJdkcKrjZ1YI4KGyncaLgkIHQ79feXI8P2rWgLxEfumA5-mCwZtZI-0rBRChNtTYgHJmWPjCSXvRvw3o7CrSeUQ7LHOsUNZI4YMIZkZO0uet7vd7u6XNEhM1o551A3wizjH-L7_X2Jx9RAZ9noWjDP6XNTiGJx-VO8sITY1Bz20a6kylKbNh_9bhNIAwJjpEo2FndkYcWHSCOCZMT9-j0xXGMJie-rTrpqYaxh8z4UCNKuldJ2ZvRnXqqelVOdBncnV2v5MSvFxekvtlBRYicwLM-ewOle7TOrhFf05RUlBZ3jJWOXujJU_Zoc1rsDqFQTvP06Mtw5Gn3JxWzjHYrKyVlQfuIP1Z-6CQ-5lfmxY1y0zM0McFhhfychk1o8EWVqViWX1-r8p3wf9mF_a1mUmZGC_d1fCPOhSh9AMhTcNgoIyhgKVQz5NJUk3KGKZV5AHyA-_RQbReeKP5HePkt10lukBqC-hKGjLg6wXaJjh9CBU6PYbDB6iD8zxg7UpcmChL42KgorTzjGX5K2oLsQ3WKgN_S5dH7Ikx7U5xJEkcmoIZLBWF-cnljXX_ip-5REpCPiCH8gnvXK0BMbhAIforrSFRZ0vkQp3YokB1G8MrZpvf78_VQasMJsyU2QQxbXoE_UrVcSLpP6BN1v4PFdWZIPHQJg=w2048-h2048-no"
  },
  {
    nome_alvo: "catedral-galeria-fachada-11.webp",
    tipo: "portrait_4_5",
    destinos: [path.join(__dirname, '../../public/images/galleries/arquitetura/catedral-galeria-fachada-11.webp')],
    width: 600,
    height: 750,
    quality: 80,
    url: "https://lh3.googleusercontent.com/pw/AP1GczPYNGTW-vDPKJwgmn73bc-aOoYbWBhWoDtMAQ5PxrjH5xN4M57SjuUap5nvpzEdxiPtN44-e63nC9H5zvVOPalUNcN3NraveJg-2RVAQ3wCNktMw787dL_LzwiRiy9zIEBWA6jN64rmqvMGEaZ2icrYkow366M9auUUKuCjWKT1VKFLDoGNW6djHY6-TkZ80_SqJo_l6AaEefYTT0r3YBvQhNUaMHwNIn4FB9QGG1zmuf-fT99yor-ueTkNyn5hEXfD33-2KUZEDoqkLvJqmS_6R52qaDeNYMDS85yuBkBgzZkB7-2OC1Fc2yUw1o6sXAbKWKsVGtKHaBkcU6WY2iVKx-9KexIUoPVhpCzRbzmBgDlu8AlIQVOvMeuGjS07JuJgXtjWM9VwkWykntkxpsfVP_rTtPiKTLVI69WEPpYgO31LZq9dKsWo6Thg2zLES6GztAjDQOoEVO6OqyuZK2Ux3rSMJ2DxEyN8Tnpln_Px-2BalMP-tQ_bd6UiUCzU_6zUXBYdRNIxgKX_VJmMMp7Wne-DxJSKSwMcvjPrawjLpCIMlE2LfaW3VX70SbmX-ZO769NU3_TRvYlpaQow-efpbJaJmdT5_2eEeETzCLmBpQp1ilgO5NYo-m_o5AKEzDilMMG2XC43t9M_3Mw6jafWPcfjkLqlRC0Ui4ca9DqdKj0wPrk4vyTtsV6c8W1GWXGQIXD06OcOdHr_3CvEm1gN4s159u1JrNBqeMdX7nu2bYBLyDj8jXouDJRHS_NTEA3xKFYehBYyFxeeHdpVypNL7DmL-nkc5svdKmqkzQe1MTr10Nfhe8oWHJ0Hc8Tltc8e3gw3fpBPD9pjk2C42skpmLB3qjxtr_Umr67IKkl_tu0hSLPVswfm78VlA5Q5nnVRV5FcZz1PycMYisVOCxyshwGr7kE93MbZqN6TutsALCbIK2Yzfej0ji94jGg-ox_G5o1o7k3WQ-wSb0NmJ1xrjGYgB5wxPuBj4QOUokl3popg-aXRbBXqFypSMDt7omNwVd_W5GcdT8kPt8l8n-Zhxf-gDyasi0w1-89u4t_aoVyzvxHvEgWR8BXjAbyOydKHbKtxrfUPp4bMnsNbb0nRheYOrA6tQEBM=w2048-h2048-no"
  },
  {
    nome_alvo: "catedral-hero-coro.webp",
    tipo: "hero_16_9",
    destinos: [
      path.join(__dirname, '../../public/images/home/catedral-hero-coro.webp'),
      path.join(__dirname, '../../public/images/galleries/interior/catedral-hero-coro.webp')
    ],
    width: 1600,
    height: 900,
    quality: 80,
    url: "https://lh3.googleusercontent.com/pw/AP1GczM9JvP3CJEIK2-t4r7QUvzuOZ5etyPWDnItAWXpGMF_Ta7RDV2cvgk9559hMdK6hfw5sZhqvcWrGRKdzg1t0k49G5q0el2yvf5kBaQZ6MBbwull8TAIEadQyuhltTFAag7_MwTlAZXdIidCGRYth-R_DcDfj4Q0hCtz8cE0b-rXOIv6DdBoFXvassO17maZM8N4TF5JixCXhKDYYXKctlGJxX5iqbFdClWww8hnOJEohwRr7K4n7o1yi1aW0-yvPcFZNdvyekbA00LJ0-xhOd-8F41DBk_W8W_5orOlSzYoXcI5xqdMTp2RJsps4xOPIpP7oCp8r9ljJczI879zezS_TCEItm342BnylporS27zZU8fr9SbyW6qcWT6yP3pyd1oIJyp2B4QsN3fpCtj2SO2GlgDqV3yKvZyXwT9a3p2yaZ_b50ILB4b-RA27L1-FZ8yJBNPZb8hlldSZXZ67WVG1nBShb14PnnkAknFUoa3cWqZeC32lCi9J_WtU2pmUu8oBu9eoFrZLhNnClC_XeLHceFXUIeQt3zQ2TyDdrjVnwZoRxthq7fcRP5nbVJEQrqD79RYoEgyZg1CVmvCEghH2crTN7IN19VBX__sPVfQVCXZ6ei2AnA49pMdJTJtWy4phIsDD9se3Y2atjdniMAj1TLioLKoELpCVdSjjcuCptGQdXu0HesXVKgYBn9JPleLa0C8KyO-tRY_uH0a0m83q2bBH6_C6v0gJUxoTmg9NShygcZtRcOVvI6FpgjtBmqUyV9Q1_-N5Vk7a2LtWOptKQ5VKlhhlQXpRliFxUo53OWXiWGa-s0UWIiPjBsQEJx2a59l47YWt5V0A40m2sK_YwxPFUEVZL1jpuSkxN1ECRc0xo57BdOWK6PEqEY5YchHRt_FqyVBcODn9QtvhlofgEzTHyQOMIaSzCYBKnLUzP4T6swxU4rQmoObqkeKl8tSY84jKNAK1J3qRhFUhMcjBDElJ5g2git2dPFAwdaQEbhFOCJn9bHB5ppLR-LF8uc4xFqL_fHbXFU8zCGP9v7HocYV1WhKQ-PZB7Ryf9vdqjTC6mL_w4xVBF4-6REH36LIInDqnfJNNJs8FGjsODiAJ0J994f96c5t=w2048-h2048-no"
  },
  {
    nome_alvo: "nave-central-simetrica.webp",
    tipo: "hero_16_9",
    destinos: [
      path.join(__dirname, '../../public/images/historia/nave-central-simetrica.webp'),
      path.join(__dirname, '../../public/images/galleries/interior/nave-central-simetrica.webp')
    ],
    width: 1600,
    height: 900,
    quality: 80,
    url: "https://lh3.googleusercontent.com/pw/AP1GczOuPNfdsje2OmdjdTl4WNOgj_yMFQZsmeCOjuEFdWaXrs-rI_PluO2uB6GTonAf1zvseESYivUrYdVqmGo8xB9RqpiJmSi4pV0CBB5EnxJDLsGxmtPvs6u-8pcmgH5fjru9xhUIMqCJXf_o1nZGchEtBu_YMiBeHmrk5hU8AWyZUiWmLdWmwbT5wrZd0Z4su0X3ppOvrtPCDnIB7M34jns2NQFrVczJejKCbrZuQxC0C3Qx9_9aD4_1rTsCvRSTlyAYMojKCv4C5JWBpUyQUmU1Ex9Ly70-At4UrP9_lf85eYPLKmBXuJCCmogx32QYBGUVJEYz63ZEswDIJ9amNdqnbCbXfQ8n1vIKElWXFkIT6a4H9aPA9cLVlQmErqcaDTrSReQ4z0nGp8l1vzjtc17xtRIRp6WPh7YRsD4MGp0qoDiajvqgka-jXKPhvW1xsuHPU-HDsYjgo0TPOMFwPE-XCb3W5qPZx-ZrgKpkejsdAzhz_7KpEyaQNpNZg6Yqa6DXJKonxt3f-OTQTekXWggcojPRU1H1o6jpC1FLgwllUd08MFMFCJ8c8cUzYAJbE2ITyaUtlm05AejiseYOg1zdFm1Nt4qOSJR8vtiLtWw5v_UUKLj0DX83WDnb_DmInydv-kWsfDK9ALc4Y79yfyUt0g1HnVUlkoWX5_E2NxjNPCCeosqQbsjivnjvZAsbpjm6Y_rHLSFPfNmwmvPKaoWXeH36DU5x2yi_rxyv4uE06JZjHi6sjatfaZragmHMRW8C_MekGvai2vJ8M7VKXrTy7ATJkn62Y3X35_FEkjhxZcdElLQ4xgkwhn8Qr2DBbOmwNhAQaYnlP1GuPEI9xiM6bQwI5woUUsc1JW3S3xAH6JgzTBHa4zRkiNi5tF952CYI2Gl8qR3pWvXUGtjm1qJAjCx0TQ95DgCBLb8ge99Oc90mjYEo1Mu4QC0jSIvwehO8w0Nh2sOlItmYGWElEMo1o9ZIE9lzZ1LjFcjkiDrBfRowWREesj44Zi2d-9bMHTX-bIYRHb9pcBSzRyoVZcTIMf9gU3LurUKHAX_Y5ZC8-Y0PrNrZrFo1ZQNSxDlT14JXQ9S60wyOuqYN7r7TEt09bFQdTrppiZsh=w2048-h2048-no"
  },
  {
    nome_alvo: "vitral-frontal-arco.webp",
    tipo: "card_16_9",
    destinos: [
      path.join(__dirname, '../../public/images/historia/vitral-frontal-arco.webp'),
      path.join(__dirname, '../../public/images/galleries/vitrais/vitral-frontal-arco.webp')
    ],
    width: 1200,
    height: 675,
    quality: 80,
    url: "https://lh3.googleusercontent.com/pw/AP1GczMCA4uYJUk8JcpZKz4Fe7HEGzz7-9hr2ukW1q8CyccCKDLr0FLqWvZfdIfujcVVjkxvRGb4a2BmI0Wx3o1G2ZXMyWjbQhd9rHW7w6GHW_UW7KZaGF1K982GKgHwpicMOln3G5GnajEdEtIWqo6Yl3HOtrp2EpBNNGJ-0dwFcxI8uXUEP9G36z6X5HYcSrQoLKQZ5LzYLr1y0rge_wBfivMTWXLXS-5xp9ROlaTe0yAREpa34RjAXHm1oMaEdC4bUSEtyJYOHCWywTt53MePSH2iSEiIbdLcllPLPDWN4k53OyympzSar1ynYQzhtPqN1TsPhAzMQXYrl4_SwJO6bCebe_MdBod8fJ0RFGnxQw-FI0uYVe5Zkr4UJGSVhcnKIYv892f_D31K037zTUQqdlRCMlCm3wS4vmK6zBZGGUDo7dTkdwRPBQ_S05XHeFwfl6j6XT5ED6_c-3NP5qgS05O_YqI60AeI79VyORL9j4Fu95klWNXlLDsLtbGQwk7fBev0xLQAY9HwF4M9_QAxQU1mC086AGMArbCpBuiCHuNn7ccLpxAjgaJXM65l7ssOW1mVRXg0D-6PFYVfodeDi0jAomH005-6nr6sWMe5YHH_3kS6c-oe0HietmFNixpfsHV83XldS20qV9LQTrpMgi0NW7cg_I8IeIxsSGmtNKzZyCs3J8spvcpu0N0WWDQm_ksGZ7d8gQMhQm9YLZPX2wdfZdrZCY177KtTFiUBEGWydIlqub_bnHhat32fIBO1g3jw5B1KRZ5vDKBf6DEBVCuf2A4wze1PXriOPfISFBl77M_uVVBCPTKb77DAAeNZcgvSzfFAfEU7tOVcfwm4cjTJw6dgsnhh_k_jwyNacWWPtEQ4AujF7sFs6r5pxMK5N6ZRbYX1kLe-t7laRuLRKnQg7u-VgNVvgNDVY6g8z8BcNn8PT7daUhpbHYRky0anqVVjJa-MKyMTHQO7R74WLj_r_LlYltc-AzBuL6kYqNO2D5FlNocjRHyJUOWDhYqivtYz6fzNuQo2EERl7G3t6yFl4vC8W0fjV19hRhSht94G7Q6MaxL8xvooDq6z5I7zSmZjOQo2ounzExXvFtpCI0txmFhL8zxGRSPT=w2048-h2048-no"
  },
  {
    nome_alvo: "vitral-sagrado-coracao.webp",
    tipo: "card_16_9",
    destinos: [
      path.join(__dirname, '../../public/images/historia/vitral-sagrado-coracao.webp'),
      path.join(__dirname, '../../public/images/galleries/vitrais/vitral-sagrado-coracao.webp')
    ],
    width: 1200,
    height: 675,
    quality: 80,
    url: "https://lh3.googleusercontent.com/pw/AP1GczNwdA8hm5BKrxkkKa14JZ3Rh2Xju_i3FJB1pZyHb-oZai31bAPyAbrvYaamLyVDq3Pf00PPS-2Cfz57XEZnPGxSXYXNDnJnOnvDsl4whnJIFcMVPTXHGScDsBf11cK6N1AHRY8-FrroUNfL5rjivr3wJOPXjRZpI95_SXv4roJE7AoOYnUIMn9K4kjw8LnC6cCUGR9OV98lwOpRMZ-dh3uP3N5s5ll-eiw3fJreVnz86EBamEtCa4G1D7PwhtuzVDt4V3Y18_2OJFtVzB0pEr1rTIWXH3L41Fmg8Tx25MMSj_-ES4AYEVI63UGeoo2vTWiKbM3mfZULnUf6ma-mun-9pqN8yZOJTouflE0evwNuIAL2R0W6WmjurFEjErlbDGWQRvw-wjxmaUEEjAcOnnwwjOg3kk2A_o4SoDlnrGxNiAjIuQ_7g73QD30x5pdg9P70UF1s6pVAT5_25EjRRVeH-YN7NjbGyTkmj_021crlbvw0pLvZmxd-lm37Hek1UpjaJYQmaXHobyhQhV2laxFyH5gr1yXcFNbLQtGBTFFw_INWKWN939u4Nt9AA98VwMBRawaT6yt8abn7NO9GMGjp3curu4v9jn7mybvIchbomx7DT9e0FvyFjDlJU9DJzpfl2IyNx78o3qHnm7UpQplnJ5ew8ycIgqSpCuYcBcQyUcmbNNrsSg5dgej5P-9sCYErbnieTq-HtFqNm72dihvzBQFdutzeIdfW-oveN_iLn5qdIPAnbiaO_5cOBB9ayybYbCNdLj3DGf8YCXziMl9lxxmFn7jce_kzVqpoWvTCiADieFARvllMxIqWlVftVxMqNSVyjogv8KfwYmSiABLIPE7S9e4KvnEQPlVlizdr1vJMThBubvOvxol3BEM48PI9TA_s2yhyo1fuT86YhxwtRCmfEOY3rscXgfD3am-IxnOUae6qcuzVKLvWuGzAeZUoYJd2ghWayHaaBPvElBQ6lnotSNcOZrfcoNSFDiv_uSNpczbi-oK9gCJrxFiMjsXBU_guky-Er-jIWySPOYQp-66LgFkOnIJ5ffBKdFfnAyw81thNRFXbioWTQr5WMO6eaYDBO2GDHuyvN1xajCAE-v6k6NSFQTks=w2048-h2048-no"
  },
  {
    nome_alvo: "batisterio-catedral.webp",
    tipo: "card_16_9",
    destinos: [
      path.join(__dirname, '../../public/images/historia/batisterio-catedral.webp'),
      path.join(__dirname, '../../public/images/secretaria/batisterio-catedral.webp'),
      path.join(__dirname, '../../public/images/galleries/interior/batisterio-catedral.webp')
    ],
    width: 1200,
    height: 675,
    quality: 80,
    url: "https://lh3.googleusercontent.com/pw/AP1GczM8Smbj5rDZ_U2MG-qKjZj6pY3cft0IWB_D3pRA7uovjI9S8lVLIUrHGP4CgFW8MtWOxCkTmxuhA3yf3pZc2n0M2VV8hEkls6ac8jQ_XNTM3QZwcJcnY1UnXZYbAf5mqRMbKTKcZf3SEulh6ltjhXS-wN7bv0YUVSW7l5oYrvFeGyaPxeLzkBQ8-pO3wpF6hEtItEWU7emDjSUPdUXGapyhwZ9lOjfAs6PmJWW9JMuJklgyEzJ5XC0YChuL51OmvB_GzUGjJELXOuHj0aSmDXq1bJ209q3PfcZ00qmqEMCuK_e6F322dMJlZGczQJnO8ETVx0vhh0uGYTbrsRHSH4Z-EcyRr3jbU0zHmZ4ar9KhoBhwSa_bZ5iI0_E1LK3TjpLaF-vcRJnILSqk3xwRmhdoOybr73Zr3kK1sKr3o3iTJxhA7YocOHjfEhUoxjXk2M07auKNR_umvYNkjH23e-TaCW_opUwD7hsxkkRd3QZG6aM6Mcb1tXwcfUsQlHpUVApsCIt5997xQNq2FDGKpPyOC6L5h2G8JNQZ-GMX4G62NxwieVZiMFhz-Y79UIh5y0-RMM3A8iyVhKSROC6W83a83LXPDOaBNy4OUF9UEpdvlrXuI3wzWo_2jchkQfWqsI8Fdc6VHirQicymJsftijNBjQi0SgC-qxGaQ5s0RQ3ByA8nONoXNAZ6mkClJKEGLqtjDASlE8TClHRiI0wZmDecAbswRrfCMTzjD0D0copUlB5IYrSSW3vwn5eVXaezZdUyMsOHE0OOA3ViZi_x_q4sXjE35T-RXPgXgiToHdLnvArSspRpr-lPoDwWZEr5W7w0k21zmrzm031xo93DvW4XXhcRH9VFn7FUuedr8AjOoCdDDK8knHCXpxH7Bc23OIcc_3XD01aY3r4dKATR0vQyJMfXRkHtTnm0pImc_Lf1-yCucCQDX6eM7jjXKEbRPIAFcAA2fFYkwvBI4XliJ0sxwKw0REk2ohEedlOR0sWoEsYsSDsy9H5jQkfBhye9Ig_sb157x3_iHqFLF217ILPM3FkB9PtcmgTrSe4DOdOVr9Re-DMLzeoiQGbAKqCMY4IV1HQf918dQkLqa5CqXPkLm3f7LLGW68ml=w2048-h2048-no"
  },
  {
    nome_alvo: "nave-reflexos-vitrais.webp",
    tipo: "card_16_9",
    destinos: [
      path.join(__dirname, '../../public/images/historia/nave-reflexos-vitrais.webp'),
      path.join(__dirname, '../../public/images/galleries/interior/nave-reflexos-vitrais.webp')
    ],
    width: 1200,
    height: 675,
    quality: 80,
    url: "https://lh3.googleusercontent.com/pw/AP1GczOgYjCAbtqTLHPWV5xJnX_daF0OSqhvrXTMnTo5xJ8g4mhrGgWvOwQwxwZR8kcj8bbN_Qt0OOdl_CCa_yv97bTRGQ5-_exhO5t64B0m5vwLh64hCKlhZ46JNf5ju7ViLbKiDU0KXZhyNFHxY_kLTF71kU2HO3dWEiMlT0sT1ZqbiIerpnMf5efRFAHO-79vtNLsEsIgOLnuuyyNrurtOjq09G1ZlHC9rejZXkh9Q7I5nLhxoZ_n4urZeX3RcF2I7ABgQSc7Gj_pW9EOOhjOwtvCHQhFHmqyMVUNLKaR_AGozghHKspcuIEg0-UWxuFRQzj68HabvxJRnPJtAPvXjTUIsOITKecVq2bt-tnbAxif7GPc4oVmOiC5l2LS55EW7uNUZt2TS8STkT9hA9QQfaWF9lrjbodh0IXsuP7G93fZb9x4hwib3E9iWUQ9cT92FpqhiIJG78UjWEBkE0w-DPcmzLudkRVsFFZTCKzvp7KjDorqzdGCLYnRzgOWJ1eUD_OJh_rxRXDogWtBmxFR3Y7walNU4gQHWrG0LOTG8n3eqFyKY6ZqtAqD4unRnYOwwp8nsnshO6eNRcssZjNG8Rrl_9-DbGf0nTdH-lL2NI2Z5tyYq8qlhXY22GAHKlgr7gC64ukbmMwXAv1Jo5vwdbKUQXFJy2M6TjwVyNwzjrvac2CLLFNhckde4F68injbTebnTluRqhCSRUGTIQogyiczhNS7qsXQUfYgQ_d7oWz2HKInl7hF4X88g3xJZSRZ7bhY7DvdiasInPqueRuKZLOv_4RliBpawc9ifDPEudT070XAu62rybR3ZZjoAD_D_oVHLLo_wygJ6HHD_l0KPKfX4Co0-i46Oj3wjYyCoa0ZFw8v2OLqECWJ25gkiW7XBLdrFOffDlGBsYnZ69ibG285HRqRZ7GsLz4iOpl1MMqh66cotyuiKA3dVRj7oozqjqLYeQSeIVj3_uzpvVzaddQObg7NPyPAObmUfmZhlz6qX33j7XymlH6ia_UMYVhSPPL3sQ_jSLhl7SkBtS6SoPi172yHZAB_VWj3yQoY43TTPF7AHtEvqM0xZq5o7xfKg73DeKfQ1RHQEWb4m5tUWgH_-ubslVlJt-0t=w2048-h2048-no"
  },
  {
    nome_alvo: "lamparina-santissimo.webp",
    tipo: "portrait_4_5",
    destinos: [
      path.join(__dirname, '../../public/images/liturgia/lamparina-santissimo.webp'),
      path.join(__dirname, '../../public/images/galleries/interior/lamparina-santissimo.webp')
    ],
    width: 600,
    height: 750,
    quality: 80,
    url: "https://lh3.googleusercontent.com/pw/AP1GczMoFnjpHmZ30hPKJcH-NHPg-x33uMx3t1-0mHiPUH4275gSe_B1g8XWs1qvVvvTbtF6Azf2yR9CriKIgKa4SKG4h4fya9r_075yF74N-Qd8X30MdKUcrqJqJB8izShAMoQbLZZcFL11wg8Rp4_Uj0j3C01fVamuDB1PANs5VBDaOPNbjjJMzguaL1Ttx6Sn5QvZH3rfoy6CEtoiFQ60LGGl13W93wq3CP8Ch9L-PbTSTXsRKX_GS9ZK9nZr_jVGqDh5bkG0Y3EdgUhW85h82yPlsBdv-vZheXB8abeFI1jjJ7egofk2m4QN73VXgxk43yMDdfxT45NNM8NHOhG5dacTPYyk0wQPvinls4Bez--1hfPHg13Vi6UMiGIoMMMXaWtB3uTzSb1cqshY_qQS8vzX6VFDzxSvxI2gtSGMJbVubs1HQt0CknssCBznFZmO6AE9KZlkEP3S3m4yedHPUdRcW7qV8s37V-pceudDDRriYmy78kneb3ATgaQtuuzYHQwgUZ6y2I5lPg1UypfqrdHLUmJpegAPz-XRrKnexqHJzgagpYBLlF28DrXzOmviJncM0k0cUFRkYbxb5grbqrrrgh77mxFmPPFbp1XFDBYz4cdJ87KyfRfZqiTJZHKmRw6pzw_rqc1j9Mg8c_D8-5O-OugCCEvSOQRxAEQK9WPQanoCODcmETrRANPDhaf5pHWJ9Fx9UBdSUu_fWo0uPYXHXS7cd26JvTQZ-KAUjF16BsJY-s_7S2-YepyGOrpU96wuDF6wRb26R4T12JDxvdEZCl_tJBTy5Iae9roTmZWPga_JBn9CSD4daWbunNjo6xE9jCMMjN97RZhKEIs-kj1h7l3_V2MNWZryNyQZGwT5DtwKTgKsfJ3VcJLdIxzveA-EbtVaZ2LI5-BSdlpqQTyTm6PII8K_GFFzs64axp7r0d1BzvGDgeRSu7QCmIdYiIoTYpKgwRsu77A7yEgJP09RncdhNZAnKrn4TBcgABcLSRyeaBZee7yKvJilweWjM12b4inlsKFqNUk3vl3bln3mzL_2ty5cDV4ZAVVVi9E1qWE40H_aGGDsmg2ToOFDyh7AYG55hm0bzR5RPZ69HLWdar3ZkbmL7FoU=w2048-h2048-no"
  },
  {
    nome_alvo: "presepio-natal-catedral.webp",
    tipo: "card_16_9",
    destinos: [
      path.join(__dirname, '../../public/images/festas/presepio-natal-catedral.webp'),
      path.join(__dirname, '../../public/images/galleries/interior/presepio-natal-catedral.webp')
    ],
    width: 1200,
    height: 675,
    quality: 80,
    url: "https://lh3.googleusercontent.com/pw/AP1GczOGp7fqw8jAf3UHmUIM6EKVryLjaUqCniTxmsv0hW_onqF6gWigNUry0PhQC6Xpj2MBJOPgqO-sZl8rxRZnS3FMEbLVIJBJuHU1moa_Sc4I9QXF1DVjoul8ofYoYH09sWYsXHNCPQH7THoqP1aS4JfvTmv3lLEEaXuzxUAHGTVBU1DlJ2A5KbOdFkl9nKnMXP9xP0z70ENe1O7D8AHUVpIQnLc762fXiPgZuBZMr3qJ9VyfJYrkYnv8wdLtquYg3sw8Vfna53qcLdViFwl6ojGwMw3-wyXcpqQ84YWH5rdY7hfu-k7H5UtkbsHTjVBbpGgKyM0yOAyAFghHBF7sAQDLyHSD_bTt65goTsbBBQTMjYC3ebXJYRhzs7S0huIe9GJreLqCmT1kp5BK0fPSm9xcYuhk-C2bsMeK0XZHWo-NYTGGmD0U-JXTIKsxC8jpwDYcUbuAJK5zPxriY4_zvLcJwgzAbH-wABgL7bbvj6SalRKMfGtqDFLa3b6Ghe32lzdrE4xK2O8qdD7ASfDCVexpLRAYz-GSqvE5Mu3WLGkyjUrei1jFbdE8d488wkNZyQl-D56udt0uC_0B28Swp4ts4G_fJzE3gIYCeKTzrKfwoTs6Rss1Q_EkBqsoq2T38xgIxr7VXmGeAny1Kzxmy0p4g-PGmlMlAbqy7BoozKR4spRJMC12-6FwoVGWGKCUjU2LqMbhgFKgWaUdp4uEmZcMK3gaw8HkwMxXl_1Q7gj7OtDJDDXoJRGy5uuQ99lkZgCOCl7ZGij0d5zNAxc35NDURtLCdcrnmJKcthvSJErXlTytCAqvX7sQ1aCmJRoSB3mGcnaMDsedMmsPsOgO7I5Jrbj5YZ2_XuCHnwNDwLlpTpp4437cO_Jye0EJJ7fVm8nNnFnST3RHRvGI5XbHqkyUj5re6wlg4vaibTSRjo9CkKYD8xKhMJrDrQsL5EamsiUmNHnCFDJXdYG3wk0kFa9QPvkX9pTT_pm1yfT5xUd33Jx7TfTgtebpP6PRfde979aeYVqGco41Lrf1fXACX9tNgyK7CYEvyrZQi1jehvN82WO7u5ihnt6nXwQTcnJ3z1v9smpzpjAY6Wx1gvKl9Qx-Qk9NzrgpZ0jv=w2048-h2048-no"
  },
  {
    nome_alvo: "acolhida-sagrado-coracao.webp",
    tipo: "portrait_4_5",
    destinos: [
      path.join(__dirname, '../../public/images/dizimo/acolhida-sagrado-coracao.webp'),
      path.join(__dirname, '../../public/images/historia/imagens-devocionais.webp')
    ],
    width: 600,
    height: 750,
    quality: 80,
    url: "https://lh3.googleusercontent.com/pw/AP1GczPSsDf2nUg4SX43HzFZXvmj0uSk9VrryEkSJq17wGmj7WLfE3Q3y5etFrQgt5Uf42FoScKjG4ONaqnoL2huJwGucTTvNM81y9I5XAWG0lYJlIiI8n-ue4qkR8vJZFea4TB89iEc1eWQ7uuq2WnOTwrzqwQNX6B8GSpWcOhyP3TDdSjrU6xZTwPqhAByAcCmTMbtyuwWQ7rm-Fdf0iRWqpNQxONjGPndwBtAZ8NhieLpkHAHy9aVDXdsfl4b2c2S_5xGcPlp16ZuCVbGM7ZC94JABZRaFUYCme5OOGuHb8yVUV6Zf9wZ6ut4vBfDEQhMsO6FnbzIS40SG9fdQmeRYnxuznN0OMXl-YEtXYE542T8gLfAeqYsvOXhqEbmddsjD7mrF_FqVVecD3ZZ6vEMTVQavOe1N-GIONCw8gMkadzbZjNw-jf1YtnxY7KnOhktAOeXdJG9ukUmPmU6p8ePdyhgjNJSJQUVbOjIBkSf5P942qKnSoPeDyP4-R2khKtuQgnMoJisKyAXfkFWdhcPA-ZzbCCfj8cjYVWrKFpr0WnMPvPTn-C-W5T1FN2Ie9HOHLbrkpVJfLlN-Yj6AE2HN8FEM9UYrlk5hbACLWUyY8UgW3UKTKH3Wq9V63asltDmmZFVVCRAvhKVZP7s8tj538pI3QOiUky3H7C0JXDN748vJUntcD50ohH0LdO1pyTGly1N0_WUe73cxE34Py2Wmvo5KUmUPQ2Og2bJo38LQP7wbSzWrlfxYm99qsi2TshKXFC_eSnc2sF8BXK_S7gj3tjxdykQ8I94M0RStoIwVrw_Tsjcj_6hD20ywZfKQWYrq9JghgyS0jQ4fUjn-fHTKfcNtgicyRpAprWIXPk6VQ2p7HJjC9mYqYvfoccOlY-g1LL0cEKOk0Bg0h97ZB8i6EoTzR_Gbwo4nM0gWcIHmqV5A3d0En7T6gBROVca8uwPErNS0AsAqHfsROCTP4efrwN8OygA2suBiXKoS18f7lBvtLCelFt1iz0sCI2AnQ244a9Fflaf_BCOT9oAcq47MUrNowWAS9GrbYBz6aJnTqUsepa_WpYYwO9xgDaPFyg8K6T9YBhYHT_1L4OmxM5kLNwzuxooCSuD-dPf=w2048-h2048-no"
  }
];

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status ${res.statusCode}`));
      }
      const data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
    }).on('error', reject);
  });
}

async function processAll() {
  console.log(`Iniciando download e processamento de ${images.length} imagens...`);
  
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    console.log(`[${i + 1}/${images.length}] Baixando: ${img.nome_alvo}...`);
    try {
      const buffer = await downloadBuffer(img.url);
      console.log(`  -> Baixado buffer de ${(buffer.length / 1024).toFixed(1)} KB. Redimensionando (${img.width}x${img.height})...`);
      
      const webpBuffer = await sharp(buffer)
        .resize(img.width, img.height, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: img.quality, effort: 6 })
        .toBuffer();

      console.log(`  -> Convertido WebP: ${(webpBuffer.length / 1024).toFixed(1)} KB`);

      for (const dest of img.destinos) {
        const dir = path.dirname(dest);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(dest, webpBuffer);
        console.log(`     Salvo em: ${dest}`);
      }
    } catch (err) {
      console.error(`  Erro ao processar ${img.nome_alvo}:`, err.message);
    }
  }

  console.log('\nProcessamento de imagens concluído com sucesso!');
}

processAll();

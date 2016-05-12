package eu.estcube.webgui;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.remote.DesiredCapabilities;

import eu.estcube.eu.IntegrationTest;

@Category(IntegrationTest.class)
public class SatelliteTest {

    private WebDriver driver;
    private String baseUrl;
    private WebElement esctube1Page;
    private WebElement esctube1FSPage;
    private List<WebElement> satellites;

    @Before
    public void setUp() throws Exception {
        DesiredCapabilities capability = DesiredCapabilities.internetExplorer();
        capability.setCapability(InternetExplorerDriver.INTRODUCE_FLAKINESS_BY_IGNORING_SECURITY_DOMAINS, true);
        driver = new InternetExplorerDriver(capability);
        baseUrl = "mcc.estcube.eu:9292";
        driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
        driver.get(baseUrl + "/MCS/");
        driver.findElement(By.name("j_username")).clear();
        driver.findElement(By.name("j_username")).sendKeys("test.admin");
        driver.findElement(By.name("j_password")).clear();
        driver.findElement(By.name("j_password")).sendKeys("testadmin");
        driver.findElement(By.id("loginButton")).click();
        satellites = driver.findElements(By.id("satelliteList"));
    }

    @Test
    public void initESTCube1PageTest() throws Exception {
        esctube1Page = satellites.get(0).findElement(By.id("estcube-1"));
        esctube1Page.click();
    }

    @Test
    public void initESTCube1FSPageTest() throws Exception {
        esctube1FSPage = satellites.get(0).findElement(By.id("estcube-1_fs"));
        esctube1FSPage.click();
    }

    @After
    public void tearDown() throws Exception {
        driver.quit();
    }

}

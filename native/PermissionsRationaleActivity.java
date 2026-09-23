package com.mrcdrnzz.dailytracker;

import android.app.Activity;
import android.os.Bundle;
import android.text.method.LinkMovementMethod;
import android.view.Gravity;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

public class PermissionsRationaleActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        int pad = (int) (24 * getResources().getDisplayMetrics().density);
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(pad, pad, pad, pad);
        root.setGravity(Gravity.CENTER_VERTICAL);
        root.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));

        TextView title = new TextView(this);
        title.setText("M/ARC Health permissions");
        title.setTextSize(22);
        title.setPadding(0, 0, 0, pad / 2);

        TextView body = new TextView(this);
        body.setText("M/ARC reads steps, sleep, heart rate, resting heart rate and active calories from Health Connect to show your dashboard and readiness. The data is stored on this device, and Android's device backup may include this app's data. If you turn on Escobar and its 'Share health data' switch, the numbers Escobar needs for an answer are sent to our coaching service (Anthropic's Claude API) for that answer only. You can turn sharing off in Settings, and change Health Connect permissions at any time in Android settings.");
        body.setTextSize(16);
        body.setMovementMethod(LinkMovementMethod.getInstance());

        root.addView(title);
        root.addView(body);
        setContentView(root);
    }
}

#
# Copyright 2022 Scott J. Johnson (https://scottjjohnson.com)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

#
# ExchangeListedNetHighLow
#
# Shows the number of new 52-week highs - new 52-week lows by day for the selected exchange. If the
# number of lows is greater than the number of highs, the value will be negative. If highs are
# greater, the number will be positive. Exchange = "ETF" shows net highs - lows for all ETFs listed
# on the 4 exchanges.
#
# The TOS symbols don't appear to work at expected when the aggregation period is WEEK so this
# study is only for daily charts.
#
declare lower;
input exchange = {default "NYSE", "NASDAQ", "AMEX", "ARCA", "ETF"};

def ap = AggregationPeriod.DAY;
def diff;
switch (exchange){
case "NYSE":
    diff = close(Symbol = "$NYHGH", period = ap) - close(Symbol = "$NYLOW", period = ap);
case "NASDAQ":
    diff = close(Symbol = "$NAHGH", period = ap) - close(Symbol = "$NALOW", period = ap);
case "AMEX":
    diff = close(Symbol = "$AMHGH", period = ap) - close(Symbol = "$AMLOW", period = ap);
case "ARCA":
    diff = close(Symbol = "$ARHGH", period = ap) - close(Symbol = "$ARLOW", period = ap);
case "ETF":
    diff = close(Symbol = "$ETFHIGH", period = ap) - close(Symbol = "$ETFLOW", period = ap);
}

plot hlp = if IsNaN(close) then Double.NaN else diff;
hlp.EnableApproximation();
hlp.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
hlp.SetLineWeight(5);
hlp.AssignValueColor(if hlp < 0 then Color.RED
                        else if hlp > 0 then Color.GREEN
                        else Color.CYAN);

plot zero = 0.0;
zero.SetDefaultColor(Color.WHITE);
zero.SetLineWeight(1);
zero.HideBubble();
zero.HideTitle();
